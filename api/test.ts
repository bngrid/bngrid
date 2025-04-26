'use server'

import db from '@/lib/db'
import redis from '@/lib/redis'
import { headers } from 'next/headers'

import { data } from './data'
import { convertWallpaper } from './image'
import { verifyToken } from './token'

export async function decrRedis() {
  try {
    const result = await redis.decr('key')
    return data(true, result ? '成功' : '失败')
  } catch {
    return data(false, '出错了')
  }
}

export async function delRedis() {
  try {
    const result = await redis.del('key')
    return data(true, `删除了 ${result} 个`)
  } catch {
    return data(false, '出错了')
  }
}

export async function expireRedis() {
  try {
    const result = await redis.expire('key', 30)
    return data(true, result ? '成功' : '失败')
  } catch {
    return data(false, '出错了')
  }
}

export async function func(f: (data: string) => void) {
  const timer = setInterval(() => {
    f('hello')
  }, 5000)
  return () => clearInterval(timer)
}

export async function getHeaders() {
  const headersList = await headers()
  return data(true, headersList)
}

export async function getRedis() {
  try {
    const result = await redis.get('key')
    return data(true, result)
  } catch {
    return data(false, '出错了')
  }
}

export async function getUserInfo() {
  try {
    const verify = await verifyToken()
    if (!verify.success) return verify
    const user = await db.user.findUnique({
      where: {
        username: verify.result.username
      }
    })
    return data(true, user)
  } catch {
    return data(false, '获取用户信息失败')
  }
}

export async function hasRedis() {
  try {
    const result = await redis.exists('key')
    return data(true, result ? '存在' : '不存在')
  } catch {
    return data(false, '出错了')
  }
}

export async function incrRedis() {
  try {
    const result = await redis.incr('key')
    return data(true, result ? '成功' : '失败')
  } catch {
    return data(false, '出错了')
  }
}

export async function setRedis() {
  try {
    const result = await redis.set('key', 10, 'EX', 30)
    return data(true, result)
  } catch {
    return data(false, '出错了')
  }
}

export async function testRedis() {
  try {
    // await redis.hset('user:1', 'name', 'Banno', 'age', 18, 'sex', '男')
    // await redis.hset('user:1', { name: 'Banno', age: 18, sex: '男' })
    // const result = await redis.hget('user:1', 'name')
    // const result = await redis.hgetall('user:1')
    // await redis.sadd('set', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    // await redis.lpush('tasks', 'task1', 'task2')
    // await redis.rpush('tasks', 'task3', 'task4', 'task5')
    // await redis.lpop('tasks')
    // await redis.rpop('tasks')
    // const result = await redis.lrange('tasks', 0, -1)
    // await redis.sadd('tags', 'nodejs', 'python', 'go', 'java')
    // const result = await redis.smembers('tags')
    await redis.zadd('scores', 100, 'Banno', 90, 'Jack', 80, 'Tom', 85, 'Joe')
    const result = await redis.zrange('scores', 0, -1, 'WITHSCORES')
    return data(true, result)
  } catch {
    return data(false, '出错了')
  }
}

export async function ttlRedis() {
  try {
    const result = await redis.ttl('key')
    return data(true, result)
  } catch {
    return data(false, '出错了')
  }
}

export async function uploadFile(file: File) {
  try {
    const res = await convertWallpaper(file)
    if (!res.success) return res
    return data(true, res.result.toString('base64'))
  } catch {
    return data(false, '出错了')
  }
}
