'use server'

import { data } from '@/api/data'
import { User } from '@/generated/prisma'
import redis from '@/lib/redis'
import generateRandomCode from '@/utils/random-string'
import { createTransport } from 'nodemailer'

type Reason = 'login' | 'modify' | 'verify'

const reasons = {
  login: '您正在尝试通过邮箱登录，请在您的验证码登录页面',
  modify: '您正在尝试修改您的用户信息，请在您的用户信息修改页面',
  verify: '我们即将创建您的 BNGRID 账户，请在您的验证码核销页面'
}

const { EMAIL_PASS: emailPass, EMAIL_USER: emailUser } = process.env
if (!emailUser || !emailPass) {
  throw new Error('未找到 EMAIL_USER 和 EMAIL_PASS 环境变量')
}

const transporter = createTransport({
  auth: {
    pass: emailPass,
    user: emailUser
  },
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true
})

export async function signEmail({ email, username }: User, reason: Reason) {
  const key = `email:code:${username}`

  if (await redis.exists(key)) {
    const ttl = await redis.ttl(key)
    if (ttl > 5 * 60) {
      return data(false, '距离上次发送时间不足一分钟')
    }
    await redis.del(key)
  }

  const code = generateRandomCode()
  const mailOptions = {
    from: emailUser,
    html: `
<div style="background-color:#E1E1E1;color:#FFFFFF;padding:30px;border-radius:10px;max-width:600px;margin-inline:auto">
	<img width="30" height="30" src="https://bngrid.com/logo.png" />
	<h2>BNGRID 邮箱验证</h2>
	<p>${username} 您好，${reasons[reason]}输入下方验证码：</p>
	<h1 style="color:#6699FF">${code}</h1>
	<p>6分钟内有效，若非您本人操作，请忽略此邮件。</p>
	<hr />
	<h3>bngrid.com</h3>
	<small>本邮件由系统自动发出，请勿回复。</small>
</div>
`.trim(),
    subject: `您的 BNGRID 验证码是：${code}`,
    text: `${username} 您好，${reasons[reason]}输入下方验证码：${code}。6分钟内有效，若非您本人操作，请忽略此邮件。`,
    to: email
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch {
    return data(false, '邮件发送失败')
  }

  await redis.hset(key, {
    code,
    reason
  })
  await redis.expire(key, 6 * 60)
  return data(true, '邮件发送成功')
}

export async function verifyEmail({ username }: User, reason: Reason, code: string) {
  const key = `email:code:${username}`

  if (!(await redis.exists(key))) {
    return data(false, '验证码校验失败')
  }

  const codeInfo = await redis.hgetall(key)
  if (codeInfo.reason !== reason || codeInfo.code !== code) {
    return data(false, '验证码校验失败')
  }

  await redis.del(key)
  return data(true, '验证码校验成功')
}
