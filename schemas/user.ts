import { z } from 'zod'

const specialRegex = /^[\w!@#$%^&*()+\-=[\]{};:',.?/]+$/
const Username = z
  .string()
  .trim()
  .nonempty('用户名不能为空')
  .min(4, '用户名长度不能小于 4 位')
  .max(16, '用户名长度不能大于 16 位')
  .regex(
    specialRegex,
    "用户名仅允许使用字母、数字及以下特殊字符：!@#$%^&*()_+-=[]{};:',.?/"
  )
const Password = z
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

export const LoginByPassword = z.object({
  username: Username,
  password: Password
})

const Email = z.string().trim().nonempty('邮箱不能为空').email('邮箱格式不正确')
const Token = z
  .string()
  .trim()
  .nonempty('验证码不能为空')
  .regex(/^[A-Z0-9]{6}$/, '验证码格式错误')

export const LoginByToken = z.object({
  email: Email,
  token: Token
})
