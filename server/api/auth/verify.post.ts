import { User } from '~~/server/types'

export default defineEventHandler(async event => {
  const { account, index } = await readBody(event)
  if (!account) {
    return response(false, '账号不能为空')
  }
  const db = await database()
  const collection = db.collection<User>('user')
  const user = await collection.findOne({ account })
  if (!user) {
    return response(false, '账号不存在')
  }
  if (!user.status) {
    return response(false, '该账户已被封禁')
  }
  const result = await sendmail(user, user._id.toString(), index)
  return result
})
