'use server'

import { verifyEmail } from '@/lib/email'
import setJwt from '@/lib/jwt'
import { Data } from '@/types/server'
import db from '@/utils/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const specialRegex = /^[\w!@#$%^&*()+\-=[\]{};:',.?/]+$/
const LoginSchema1 = z.object({
  username: z
    .string()
    .trim()
    .nonempty('用户名不能为空')
    .min(4, '用户名长度不能小于 4 位')
    .max(16, '用户名长度不能大于 16 位')
    .regex(
      specialRegex,
      "用户名仅允许使用字母、数字及以下特殊字符：!@#$%^&*()_+-=[]{};:',.?/"
    ),
  password: z
    .string()
    .trim()
    .nonempty('密码不能为空')
    .min(8, '密码长度不能小于 8 位')
    .max(16, '密码长度不能大于 16 位')
    .regex(
      specialRegex,
      "密码仅允许使用字母、数字及以下特殊字符：!@#$%^&*()_+-=[]{};:',.?/"
    )
    .refine(pwd => {
      let typesCount = 0
      if (/\d/.test(pwd)) typesCount++
      if (/[A-Z]/.test(pwd)) typesCount++
      if (/[a-z]/.test(pwd)) typesCount++
      if (/[!@#$%^&*()_+\-=[\]{};:',.?/]/.test(pwd)) typesCount++
      return typesCount >= 2
    }, '密码必须至少包含数字、大写字母、小写字母、特殊字符中的两种类型')
})
const LoginSchema2 = z.object({
  email: z.string().trim().nonempty('邮箱不能为空').email('邮箱格式不正确'),
  token: z
    .string()
    .trim()
    .nonempty('验证码不能为空')
    .regex(/^[A-Z0-9]{6}$/, '验证码格式错误')
})

export async function loginByPassword(username: string, password: string): Data<string> {
  const { success, error } = LoginSchema1.safeParse({ username, password })
  if (!success) {
    return {
      success,
      result: error.errors.map(err => err.message).join('，')
    }
  }
  const user = await db.user.findUnique({
    where: {
      username
    }
  })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, result: '账号或密码错误' }
  }
  return setJwt(user)
}

export async function loginByToken(email: string, token: string): Data<string> {
  const { success, error } = LoginSchema2.safeParse({ email, token })
  if (!success) {
    return {
      success,
      result: error.errors.map(err => err.message).join('，')
    }
  }
  const user = await db.user.findUnique({
    where: {
      email
    }
  })
  if (!user) {
    return { success: false, result: '用户不存在' }
  }
  const verify = await verifyEmail(user, 'login', token)
  if (!verify.success) {
    return verify
  }
  return setJwt(user)
}
