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
  const id = getRouterParam(event, 'id')
  const object = await collection.findOne({ _id: new ObjectId(id) })
  if (!object) {
    return response(false, '用户不存在')
  }
  collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: !object.status
      }
    }
  )
  return response(true, object.status ? '封禁成功' : '解封成功')
})
