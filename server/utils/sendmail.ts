import nodemailer from 'nodemailer'
import { User } from '../types'

export default (
  user: User,
  id: string,
  reason: 0 | 1 | 2
): Promise<{ flag: boolean; msg: string }> =>
  new Promise(res => {
    const transporter = nodemailer.createTransport({
      service: 'outlook365',
      auth: {
        user: 'bngrid@outlook.com',
        pass: process.env.dbpassword
      }
    })
    const reasons = [
      `我们即将创建您的 BNGRID 账户，请在您的验证码登录页面`,
      `您正在尝试修改您的用户信息，请在您的用户信息修改页面`,
      `您正在尝试通过邮箱登录，请在您的验证码登录页面`
    ]
    transporter.sendMail(
      {
        from: 'bngrid@outlook.com',
        to: user.account,
        subject: `您的 BNGRID 验证码是：${user.token}`,
        html: `<div style="background-color:#1e1e1e;color:#e1e1e1;padding:30px;border-radius:10px;max-width:640px;margin-inline:auto"><img src="${process.env.hostname}/icon.png"alt="BNGRID 图标"/><h2>BNGRID 邮箱验证</h2><p>${user.username} 您好，${reasons[reason]}输入下方验证码：</p><h1 style="color:#00e696">${user.token}</h1><p>若非您本人操作，请忽略此邮件。</p><hr/><h3>bngrid.com</h3><small>本邮件由系统自动发出，请勿回复。</small></div>`
      },
      error => {
        if (error) {
          res(response(false, error.message))
        }
        res(response(true, '验证邮件发送成功'))
      }
    )
  })
