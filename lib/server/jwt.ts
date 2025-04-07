'use server'

import { Data, Token } from '@/types/server'
import generateToken from '@/utils/token'
import { sign, verify } from 'jsonwebtoken'

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

export async function verifyAccess(jwt: string): Data<Token> {
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
    // [TODO] 从数据库中检查 TOKEN 是否一致
    if (result.token !== '123456') {
      return {
        success: false,
        result: 'TOKEN 令牌错误'
      }
    }
    return {
      success: true,
      result
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 解析失败'
    }
  }
}

export async function verifyRefresh(jwt: string): Data<Token> {
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
    // [TODO] 从数据库中检查 TOKEN 是否一致
    if (result.token !== '123456') {
      return {
        success: false,
        result: 'TOKEN 令牌错误'
      }
    }
    // [TODO] 生成新的 TOKEN 并修改数据库
    const newToken = generateToken()
    return {
      success: true,
      result: {
        ...result,
        token: newToken
      }
    }
  } catch {
    return {
      success: false,
      result: 'TOKEN 解析失败'
    }
  }
}
