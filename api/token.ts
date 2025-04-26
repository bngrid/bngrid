'use server'

import { User } from '@/generated/prisma'
import redis from '@/lib/redis'
import { sign, verify } from 'jsonwebtoken'
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

const { JWT_PRIVATE_KEY: priv, JWT_PUBLIC_KEY: pub } = process.env
if (!pub || !priv) throw new Error('未找到 JWT_PUBLIC_KEY 或 JWT_PRIVATE_KEY 环境变量')

export async function signToken({ email, role, username }: Omit<Token, 'nonce' | 'time'>) {
  try {
    const nonce = nanoid()
    const key = `token:${username}`
    await redis
      .pipeline()
      .hset(key, nonce, (await headers()).get('user-agent') ?? '')
      .expire(key, 3 * 24 * 60 * 60)
      .exec()
    const payload = {
      email,
      nonce,
      role,
      time: Date.now(),
      username
    }
    ;(await cookies()).set(
      'token',
      sign(payload, priv ?? '', {
        algorithm: 'RS256',
        expiresIn: '3d',
        issuer: 'banno'
      }),
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
    const token = (await cookies()).get('token')?.value
    if (!token) return data(false, 'TOKEN 不存在')
    const payload = <Token>verify(token, pub ?? '', {
      algorithms: ['RS256'],
      issuer: 'banno'
    })
    if (Date.now() - payload.time < 10 * 60 * 1000) return data(true, payload)
    const key = `token:${payload.username}`
    if ((await redis.hget(key, payload.nonce)) !== (await headers()).get('user-agent')) {
      await redis.hdel(key, payload.nonce)
      return data(false, 'TOKEN 验证失败')
    }
    return await signToken({
      email: payload.email,
      role: payload.role,
      username: payload.username
    })
  } catch {
    return data(false, 'TOKEN 验证失败')
  }
}
