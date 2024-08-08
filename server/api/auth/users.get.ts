import { Verify } from '~~/server/types'

export default defineEventHandler(async event => {
  const verification = await verify(true, getHeader(event, 'authorization'))
  if (!verification.flag) {
    return verification
  }
  const { collection } = <Verify>verification.data
  const users = await collection.find().toArray()
  return response(true, '获取成功', users)
})
