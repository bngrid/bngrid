'use server'

import { User } from '@/generated/prisma'
import { data } from '@/lib/data'
import generateRandomString from '@/utils/random-string'
import { createTransport } from 'nodemailer'

type Reason = 'verify' | 'login' | 'modify'

const codeManager = new Map<string, { reason: Reason; code: string; time: number }>()
const reasons = {
  verify: '我们即将创建您的 BNGRID 账户，请在您的验证码核销页面',
  login: '您正在尝试通过邮箱登录，请在您的验证码登录页面',
  modify: '您正在尝试修改您的用户信息，请在您的用户信息修改页面'
}
const { EMAIL_USER: emailUser, EMAIL_PASS: emailPass } = process.env
if (!emailUser || !emailPass) {
  throw new Error('未找到 EMAIL_USER 和 EMAIL_PASS 环境变量')
}
const transporter = createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass
  }
})

export async function signEmail({ id, username, email }: User, reason: Reason) {
  if (codeManager.has(id)) {
    const info = codeManager.get(id)!
    if (Date.now() - info.time < 60 * 1000) {
      return data(false, '距离上次发送时间不足一分钟')
    }
    codeManager.delete(id)
  }
  const code = generateRandomString()
  const mailOptions = {
    from: 'banno@bngrid.com',
    to: email,
    subject: `您的 BNGRID 验证码是：${code}`,
    text: `${username} 您好，${reasons[reason]}输入下方验证码：${code}。6分钟内有效，若非您本人操作，请忽略此邮件。`,
    html: `<div style="background-color:#E1E1E1;color:#FFFFFF;padding:30px;border-radius:10px;max-width:600px;margin-inline:auto">
	<img width="30" height="30" src="https://bngrid.com/logo.png" />
	<h2>BNGRID 邮箱验证</h2>
	<p>${username} 您好，${reasons[reason]}输入下方验证码：</p>
	<h1 style="color:#6699FF">${code}</h1>
	<p>6分钟内有效，若非您本人操作，请忽略此邮件。</p>
	<hr />
	<h3>bngrid.com</h3>
	<small>本邮件由系统自动发出，请勿回复。</small>
</div>`
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch {
    return data(false, '邮件发送失败')
  }
  codeManager.set(id, {
    reason,
    code,
    time: Date.now()
  })
  return data(true, '邮件发送成功')
}

export async function verifyEmail({ id }: User, reason: Reason, code: string) {
  const info = codeManager.get(id)
  if (!info || info.reason !== reason || info.code !== code) {
    return data(false, '验证码校验失败')
  }
  if (Date.now() - info.time > 6 * 60 * 1000) {
    codeManager.delete(id)
    return data(false, '验证码已过期')
  }
  codeManager.delete(id)
  return data(true, '验证码校验成功')
}
