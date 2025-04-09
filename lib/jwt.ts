'use server'

import { Data, Token } from '@/types/server'
import { User } from '@/types/user'
import db from '@/utils/db'
import generateToken from '@/utils/token'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function signAccess(userid: string, token: string): Data<string> {
  const publicKey = process.env.JWT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
  }
  try {
    return {
      success: true,
      result: sign(
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
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 生成失败'
    }
  }
}

export async function signRefresh(userid: string, token: string): Data<string> {
  const publicKey = process.env.JWT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('未找到 JWT_PUBLIC_KEY 环境变量')
  }
  try {
    return {
      success: true,
      result: sign(
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
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 生成失败'
    }
  }
}

export async function verifyAccess(jwt: string): Data<string> {
  const privateKey = process.env.JWT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
  }
  try {
    const result = verify(jwt, privateKey, {
      issuer: 'banno'
    }) as Token
    if (result.type !== 'access') {
      return {
        success: false,
        result: 'TOKEN 类型错误'
      }
    }
    const user = await db.user.findUnique({
      where: {
        id: result.userid
      }
    })
    if (!user) {
      return { success: false, result: '用户不存在' }
    }
    if (result.token !== user.token) {
      return {
        success: false,
        result: 'TOKEN 令牌错误'
      }
    }
    return {
      success: true,
      result: result.userid
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 解析失败'
    }
  }
}

export async function verifyRefresh(jwt: string): Data<User> {
  const privateKey = process.env.JWT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('未找到 JWT_PRIVATE_KEY 环境变量')
  }
  try {
    const result = verify(jwt, privateKey, {
      issuer: 'banno'
    }) as Token
    if (result.type !== 'access') {
      return {
        success: false,
        result: 'TOKEN 类型错误'
      }
    }
    const user = await db.user.findUnique({
      where: {
        id: result.userid
      }
    })
    if (!user) {
      return { success: false, result: '用户不存在' }
    }
    if (result.token !== user.token) {
      return {
        success: false,
        result: 'TOKEN 令牌错误'
      }
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
    return {
      success: true,
      result: newUser
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 解析失败'
    }
  }
}

export default async function setJwt({ id, token }: User): Data<string> {
  const { 0: accessToken, 1: refreshToken } = await Promise.all([
    signAccess(id, token),
    signRefresh(id, token)
  ])
  if (!accessToken.success || !refreshToken.success) {
    return { success: false, result: 'TOKEN 生成失败' }
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
  return { success: true, result: '登录成功' }
}
