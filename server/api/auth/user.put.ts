import { Verify } from '~~/server/types'

export default defineEventHandler(async event => {
  const verification = await verify(getHeader(event, 'authorization'))
  if (!verification.flag) {
    return verification
  }
  const { collection, user } = <Verify>verification.data
  const { username, account, password, token } = await readBody(event)
  if (token !== user.token) {
    return response(false, '验证码不正确')
  }
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
  collection.updateOne(user, {
    $set: {
      username,
      account,
      password: password ? hmac(password) : user.password,
      token: random()
    }
  })
  return response(true, '修改成功，请重新登录')
})
