import { Redis } from 'ioredis'

type Global = typeof globalThis & {
  redis?: Redis
}

const { REDIS_HOST: redisHost, REDIS_PASSWORD: redisPassword } = process.env
if (!redisHost || !redisPassword) throw new Error('未找到 REDIS_HOST 或 REDIS_PASSWORD 环境变量')

const globalWithRedis = <Global>global

const redis =
  globalWithRedis.redis ??
  new Redis({
    host: redisHost,
    password: redisPassword
  })

if (process.env.NODE_ENV !== 'production') globalWithRedis.redis = redis

export default redis
