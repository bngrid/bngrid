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
  const users = await collection.find().toArray()
  return response(true, '获取成功', users)
})
