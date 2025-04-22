import { z } from 'zod'

const stringWithLength = ({
  field,
  length,
  max,
  min
}: {
  field: string
  length?: number
  max?: number
  min?: number
}) => {
  let schema = z.string().trim().nonempty(`${field}不能为空`)
  if (length !== undefined) {
    schema = schema.length(length, `${field}长度必须为 ${length} 位`)
  }
  if (min !== undefined) {
    schema = schema.min(min, `${field}长度不能小于 ${min} 位`)
  }
  if (max !== undefined) {
    schema = schema.max(max, `${field}长度不能大于 ${max} 位`)
  }
  return schema
}
const Username = stringWithLength({ field: '用户名', max: 16, min: 4 })
  .toLowerCase()
  .regex(
    /^(?![-])(?!.*[-]{2})[a-z0-9-]+(?<![-])$/,
    '用户名仅允许使用小写字母、数字及单个连字符，且不能以连字符开头或结尾'
  )
const Password = stringWithLength({ field: '密码', max: 32, min: 8 })
  .regex(
    /^[A-Za-z0-9!@#$%^&*()_+\-=\{\}\[\]\|\\:;\"'<>,\.?\/~`]+$/,
    '密码仅允许使用字母、数字、特殊字符'
  )
  .refine(pwd => {
    let typesCount = 0
    if (/\d/.test(pwd)) typesCount++
    if (/[A-Z]/.test(pwd)) typesCount++
    if (/[a-z]/.test(pwd)) typesCount++
    if (/[A-Za-z0-9!@#$%^&*()_+\-=\{\}\[\]\|\\:;\"'<>,\.?\/~`]/.test(pwd)) typesCount++
    return typesCount >= 3
  }, '密码必须至少包含数字、大写字母、小写字母、特殊字符中的三种类型')
const Email = stringWithLength({ field: '邮箱', max: 60 }).email('邮箱格式不正确')
const Code = stringWithLength({ field: '验证码', length: 6 })
  .toUpperCase()
  .regex(/^[A-Z0-9]+$/, '验证码格式错误')

export const RegisterSchema = z.object({
  email: Email,
  password: Password,
  username: Username
}).safeParse

export const LoginByPasswordSchema = z.object({
  password: Password,
  username: Username
}).safeParse

export const LoginByCodeSchema = z.object({
  code: Code,
  email: Email
}).safeParse
