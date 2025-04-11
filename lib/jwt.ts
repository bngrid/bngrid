'use server'

import { Token } from '@/types/server'
import { User } from '@/types/user'
import { data } from '@/utils/data'
import db from '@/utils/db'
import generateToken from '@/utils/token'
import { da } from 'date-fns/locale'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function signAccess(userid: string, token: string) {
  const publicKey = process.env.JWT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
  }
  try {
    return data(
      true,
      sign(
        {
          userid,
          token,
          type: 'access'
        },
        publicKey,
        {
          issuer: 'banno',
          expiresIn: '30m'
        }
      )
    )
  } catch {
    return data(false, 'TOKEN 生成失败')
  }
}

export async function signRefresh(userid: string, token: string) {
  const publicKey = process.env.JWT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
  }
  try {
    return data(
      true,
      sign(
        {
          userid,
          token,
          type: 'refresh'
        },
        publicKey,
        {
          issuer: 'banno',
          expiresIn: '30d'
        }
      )
    )
  } catch {
    return data(false, 'TOKEN 生成失败')
  }
}

export async function verifyAccess(jwt: string) {
  const privateKey = process.env.JWT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
  }
  try {
    const result = verify(jwt, privateKey, {
      issuer: 'banno'
    }) as Token
    if (result.type !== 'access') {
      return data(false, 'TOKEN 类型错误')
    }
    const user = await db.user.findUnique({
      where: {
        id: result.userid
      }
    })
    if (!user) {
      return data(false, '用户不存在')
    }
    if (result.token !== user.token) {
      return data(false, 'TOKEN 令牌错误')
    }
    return data(true, result.userid)
  } catch {
    return data(false, 'TOKEN 解析失败')
  }
}

export async function verifyRefresh(jwt: string) {
  const privateKey = process.env.JWT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
  }
  try {
    const result = verify(jwt, privateKey, {
      issuer: 'banno'
    }) as Token
    if (result.type !== 'access') {
      return data(false, 'TOKEN 类型错误')
    }
    const user = await db.user.findUnique({
      where: {
        id: result.userid
      }
    })
    if (!user) {
      return data(false, '用户不存在')
    }
    if (result.token !== user.token) {
      return data(false, 'TOKEN 令牌错误')
    }
    const newToken = generateToken()
    const newUser = await db.user.update({
      where: {
        id: result.userid
      },
      data: {
        token: newToken
      }
    })
    return data(true, newUser)
  } catch {
    return data(false, 'TOKEN 解析失败')
  }
}

export default async function setJwt({ id, token }: User) {
  const { 0: accessToken, 1: refreshToken } = await Promise.all([
    signAccess(id, token),
    signRefresh(id, token)
  ])
  if (!accessToken.success || !refreshToken.success) {
    return data(false, 'TOKEN 生成失败')
  }
  const cookieStore = await cookies()
  const cookieOptions = { httpOnly: true, secure: true, sameSite: true }
  cookieStore.set('access', accessToken.result, {
    ...cookieOptions,
    maxAge: 30 * 60
  })
  cookieStore.set('refresh', refreshToken.result, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60
  })
  return data(true, '登录成功')
}
