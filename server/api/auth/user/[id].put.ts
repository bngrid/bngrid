import { ObjectId } from 'mongodb'
import { Verify } from '~~/server/types'

export default defineEventHandler(async event => {
  const verification = await verify(getHeader(event, 'authorization'))
  if (!verification.flag) {
    return verification
  }
  const { collection, user } = <Verify>verification.data
  if (user.username !== process.env.dbaccount) {
    return response(false, '权限不足')
  }
  const { username, account, password } = await readBody(event)
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(account)) {
    return response(false, '账号格式不正确')
  }
  if (password && password.length < 8) {
    return response(false, '密码长度不能低于8位')
  }
  const count = await collection.countDocuments({ $or: [{ username }, { account }] })
  if (count) {
    return response(false, '用户名和账号不能重复')
  }
  const id = getRouterParam(event, 'id')
  const object = await collection.findOne({ _id: new ObjectId(id) })
  if (!object) {
    return response(false, '用户不存在')
  }
  collection.updateOne(object, {
    $set: {
      username,
      account,
      password: password ? hmac(password) : object.password
    }
  })
  return response(true, '修改成功')
})
