import { Verify } from '~~/server/types'

function timeout(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff / (1000 * 60 * 60 * 24) > 60) {
    return true
  }
  return false
}

export default defineEventHandler(async event => {
  const token = getHeader(event, 'authorization')
  const verification = await verify(token)
  if (!verification.flag) {
    return verification
  }
  const { user } = <Verify>verification.data
  if (timeout(user.updata)) {
    return response(false, '登录失效')
  }
  return response(true, '获取成功', user)
})
