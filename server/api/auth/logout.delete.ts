import { Verify } from '~~/server/types'
import verify from '~~/server/utils/verify'

export default defineEventHandler(async event => {
  const verification = await verify(false, getHeader(event, 'authorization'))
  if (!verification.flag) {
    return verification
  }
  const { collection, user } = <Verify>verification.data
  collection.updateOne(user, {
    $set: {
      token: random()
    }
  })
  return response(true, '登出成功')
})
