import { User } from '~~/server/types'
import { createCipheriv, scryptSync } from 'node:crypto'

function cipher(value: string, token: string) {
  const algorithm = 'aes-256-cbc'
  const key = scryptSync(process.env.secretkey!, 'salt', 32)
  const iv = Buffer.alloc(16, 6)
  const cipher = createCipheriv(algorithm, key, iv)
  return cipher.update(`${token}|${value}`, 'utf8', 'hex') + cipher.final('hex')
}

export default defineEventHandler(async event => {
  const { account, code } = await readBody(event)
  if (!account || !code) {
    return response(false, '账号和验证码不能为空')
  }
  const db = await database()
  const collection = db.collection<User>('user')
  const user = await collection.findOne({ account })
  if (!user || user.token !== code) {
    return response(false, '账号或验证码错误')
  }
  if (!user.status) {
    return response(false, '该账户已被封禁')
  }
  const token = random()
  collection.updateOne(user, {
    $set: {
      token,
      active: true,
      updata: new Date()
    }
  })
  return response(true, '登录成功', cipher(user._id.toString(), token))
})
