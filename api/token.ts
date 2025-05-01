'use server'

import { User } from '@/generated/prisma'
import redis from '@/lib/redis'
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { cookies, headers } from 'next/headers'

import { data } from './data'

type Token = {
  email: string
  nonce: string
  role: User['role']
  time: number
  username: string
}

const { JWT_PRIVATE_KEY: privPem, JWT_PUBLIC_KEY: pubPem } = process.env
if (!privPem || !pubPem) {
  throw new Error('未找到 JWT_PRIVATE_KEY 或 JWT_PUBLIC_KEY 环境变量')
}
const privKey = importPKCS8(privPem, 'RS256')
const pubKey = importSPKI(pubPem, 'RS256')

export async function signToken({ email, role, username }: Omit<Token, 'nonce' | 'time'>) {
  try {
    const { 0: header, 1: cookie, 2: priv } = await Promise.all([headers(), cookies(), privKey])
    const nonce = nanoid()
    const key = `token:${username}`
    await redis
      .multi()
      .hset(key, nonce, header.get('user-agent') ?? '')
      .expire(key, 3 * 24 * 60 * 60)
      .exec()
    const payload = { email, nonce, role, time: Date.now(), username }
    cookie.set(
      'token',
      await new SignJWT(payload).setProtectedHeader({ alg: 'RS256' }).setIssuer('banno').setIssuedAt().setExpirationTime('3d').sign(priv),
      {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60,
        sameSite: 'strict',
        secure: true
      }
    )
    return data(true, payload)
  } catch {
    return data(false, 'TOKEN 生成失败')
  }
}

export async function verifyToken() {
  try {
    const { 0: header, 1: cookie, 2: pub } = await Promise.all([headers(), cookies(), pubKey])
    const token = cookie.get('token')?.value
    if (!token) return data(false, 'TOKEN 不存在')
    const { payload } = (await jwtVerify(token, pub, {
      algorithms: ['RS256'],
      issuer: 'banno'
    })) as { payload: Token }
    if (Date.now() - payload.time < 10 * 60 * 1000) return data(true, payload)
    const key = `token:${payload.username}`
    if ((await redis.hget(key, payload.nonce)) !== header.get('user-agent')) {
      await redis.hdel(key, payload.nonce)
      return data(false, 'TOKEN 验证失败')
    }
    return signToken(payload)
  } catch {
    return data(false, 'token validation failed')
  }
}
