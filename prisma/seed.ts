import { PrismaClient } from '@/generated/prisma'
import { genSaltSync, hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('正在添加超级管理员……')
  const salt = genSaltSync()
  const password = process.env.USER_PASSWORD
  if (!password) {
    throw new Error('未找到 USER_PASSWORD 环境变量')
  }
  const user = await prisma.user.upsert({
    create: {
      email: 'bngrid@outlook.com',
      password: hashSync(password, salt),
      role: 'super',
      status: 'active',
      username: 'bngrid'
    },
    update: {},
    where: {
      username: 'bngrid'
    }
  })
  console.log('超级管理员已添加：', user)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
