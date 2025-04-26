'use server'

import db from '@/lib/db'
import { LoginByCodeSchema, LoginByPasswordSchema, RegisterSchema } from '@/schemas/user'
import { compare, genSaltSync, hashSync } from 'bcryptjs'

import { data } from './data'
import { signEmail, verifyEmail } from './email'
import { signToken } from './token'

const errors: Record<string, string> = {
  banned: '您的账号已被封禁',
  deleted: '您的账号已被删除',
  pending: '您的账号尚未验证'
}

export async function loginByCode({ code, email }: { code: string; email: string }) {
  try {
    const parse = LoginByCodeSchema.safeParse({ code, email })
    if (!parse.success) return data(false, parse.error.errors[0].message)
    const user = await db.user.findUnique({
      where: {
        email
      }
    })
    if (!user) return data(false, '用户不存在')
    const verify = await verifyEmail({ code, reason: 'login', username: user.username })
    if (!verify.success) return verify
    if (errors[user.status]) return data(false, errors[user.status])
    return await signToken(user)
  } catch {
    return data(false, '登录失败')
  }
}

export async function loginByPassword({ password, username }: { password: string; username: string }) {
  try {
    const parse = LoginByPasswordSchema.safeParse({ password, username })
    if (!parse.success) return data(false, parse.error.errors[0].message)
    const user = await db.user.findUnique({
      where: {
        username
      }
    })
    if (!user || !(await compare(password, user.password))) return data(false, '用户名或密码错误')
    if (errors[user.status]) return data(false, errors[user.status])
    return await signToken(user)
  } catch {
    return data(false, '登录失败')
  }
}

export async function register({ email, password, username }: { email: string; password: string; username: string }) {
  try {
    const parse = RegisterSchema.safeParse({ email, password, username })
    if (!parse.success) return data(false, parse.error.errors[0].message)
    const user = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    })
    if (user) {
      if (user.username === username) return data(false, '用户名已被注册')
      return data(false, '邮箱已被注册')
    }
    await db.user.create({
      data: {
        email,
        password: hashSync(password, genSaltSync()),
        username
      }
    })
    return data(true, '注册成功，请前往邮箱验证')
  } catch {
    return data(false, '注册失败')
  }
}

export async function signVerifyEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })
    if (!user) return data(false, '用户不存在')
    if (user.status !== 'pending') return data(false, '用户已验证')
    return await signEmail({
      reason: 'verify',
      user
    })
  } catch {
    return data(false, '验证码发送失败')
  }
}

export async function verifyVerifyEmail({ code, email }: { code: string; email: string }) {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })
    if (!user) return data(false, '用户不存在')
    if (user.status !== 'pending') return data(false, '用户已验证')
    const verify = await verifyEmail({
      code,
      reason: 'verify',
      username: user.username
    })
    if (!verify.success) return verify
    await db.user.update({
      data: { status: 'active' },
      where: { email }
    })
    return data(true, '邮箱验证成功')
  } catch {
    return data(false, '邮箱验证失败')
  }
}
