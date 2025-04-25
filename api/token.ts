'use server'

import { data } from '@/api/data'
import { User } from '@/generated/prisma'
import redis from '@/lib/redis'
import { sign, verify } from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { cookies, headers } from 'next/headers'

type Token = {
  email: string
  jwt: string
  role: User['role']
  time: number
  username: string
}

const { JWT_PRIVATE_KEY: privateKey, JWT_PUBLIC_KEY: publicKey } = process.env
if (!publicKey || !privateKey) {
  throw new Error('未找到 JWT_PUBLIC_KEY 或 JWT_PRIVATE_KEY 环境变量')
}

export async function signToken({
  email,
  role,
  username
}: {
  email: string
  role: User['role']
  username: string
}) {
  try {
    const jwt = nanoid()
    await redis
      .pipeline()
      .hset(`token:${username}`, jwt, (await headers()).get('user-agent') ?? '')
      .expire(`token:${username}`, 3 * 24 * 60 * 60)
      .exec()
    const token = {
      email,
      jwt,
      role,
      time: Date.now(),
      username
    }
    ;(await cookies()).set(
      'token',
      sign(token, privateKey ?? '', {
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
    return data(true, token)
  } catch {
    return data(false, 'TOKEN 生成失败')
  }
}

export async function verifyToken() {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) {
      return data(false, 'TOKEN 不存在')
    }
    const result = <Token>verify(token, publicKey ?? '', {
      algorithms: ['RS256'],
      issuer: 'banno'
    })
    if (result.time + 10 * 60 * 1000 < Date.now()) {
      if (
        (await redis.hget(`token:${result.username}`, result.jwt)) !==
        (await headers()).get('user-agent')
      ) {
        await redis.hdel(`token:${result.username}`, result.jwt)
        return data(false, 'TOKEN 验证失败')
      }
      return await signToken({
        email: result.email,
        role: result.role,
        username: result.username
      })
    }
    return data(true, result)
  } catch {
    return data(false, 'TOKEN 验证失败')
  }
}
