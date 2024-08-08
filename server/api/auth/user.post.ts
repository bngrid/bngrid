import { Verify } from '~~/server/types'

export default defineEventHandler(async event => {
  const verification = await verify(true, getHeader(event, 'authorization'))
  if (!verification.flag) {
    return verification
  }
  const { collection } = <Verify>verification.data
  const { username, account, password } = await readBody(event)
  if (!username || !account || !password) {
    return response(false, '用户名、账号和密码不能为空')
  }
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(account)) {
    return response(false, '账号格式不正确')
  }
  if (password.length < 8) {
    return response(false, '密码长度不能低于8位')
  }
  const count = await collection.countDocuments({ $or: [{ username }, { account }] })
  if (count) {
    return response(false, '用户名和账号不能重复')
  }
  const token = random()
  const newuser = {
    username,
    account,
    password: hmac(password),
    coin: 0,
    status: true,
    active: false,
    token: token,
    create: new Date(),
    updata: new Date()
  }
  const id = (await collection.insertOne(newuser)).insertedId
  const result = await sendmail(newuser, id.toString(), 0)
  if (!result.flag) {
    return result
  }
  return response(true, '注册成功，请尽快完成邮箱验证')
})
