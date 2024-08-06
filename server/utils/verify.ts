import { ObjectId } from 'mongodb'
import { User } from '~~/server/types'
import { createDecipheriv, scryptSync } from 'node:crypto'

function decipher(value: string) {
  const algorithm = 'aes-256-cbc'
  const key = scryptSync(process.env.secretkey!, 'salt', 32)
  const iv = Buffer.alloc(16, 6)
  const decipher = createDecipheriv(algorithm, key, iv)
  let original: string
  try {
    original = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8')
  } catch (error) {
    original = ''
  }
  return original
}

export default async (token?: string) => {
  if (!token) {
    return response(false, '未获取到令牌')
  }
  const original = decipher(token.slice(7))
  if (!original.includes('|')) {
    return response(false, '令牌无效')
  }
  const db = await database()
  const collection = db.collection<User>('user')
  const user = await collection.findOne({ _id: new ObjectId(original.split('|')[1]) })
  if (!user || user.token !== original.split('|')[0]) {
    return response(false, '令牌无效')
  }
  if (!user.status) {
    return response(false, '该账户已被封禁')
  }
  return response(true, '授权成功', { collection, user })
}
