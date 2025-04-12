'use server'

import { data } from '@/lib/data'
import { verifyEmail } from '@/lib/email'
import { checkJWT, clearJWT, setJWT } from '@/lib/jwt'
import { LoginByPassword, LoginByToken } from '@/schemas/user'
import db from '@/utils/db'
import bcrypt from 'bcryptjs'

export async function loginByPassword(username: string, password: string) {
  const { success, error } = LoginByPassword.safeParse({ username, password })
  if (!success) {
    return data(success, error.errors.map(err => err.message).join('，'))
  }
  try {
    const user = await db.user.findUnique({
      where: {
        username
      }
    })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return data(false, '用户名或密码错误')
    }
    return setJWT(user)
  } catch {
    return data(false, '数据库错误')
  }
}

export async function loginByToken(email: string, token: string) {
  const { success, error } = LoginByToken.safeParse({ email, token })
  if (!success) {
    return data(success, error.errors.map(err => err.message).join('，'))
  }
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      return data(false, '用户不存在')
    }
    const verify = await verifyEmail(user, 'login', token)
    if (!verify.success) {
      return verify
    }
    return setJWT(user)
  } catch {
    return data(false, '数据库错误')
  }
}

export async function register() {}

export async function logout() {
  const check = await checkJWT()
  if (!check.success) {
    return check
  }
  return clearJWT(check.result)
}
