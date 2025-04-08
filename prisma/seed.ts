import { PrismaClient } from '@/generated/prisma'
import generateToken from '@/utils/token'
import { genSaltSync, hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('正在添加超级管理员……')
  const salt = genSaltSync()
  const password = process.env.GLOBAL_PASSWORD
  if (!password) {
    throw new Error('未找到 GLOBAL_PASSWORD 环境变量')
  }
  const user = await prisma.user.upsert({
    where: {
      username: 'bngrid'
    },
    update: {},
    create: {
      username: 'bngrid',
      password: hashSync(password, salt),
      email: 'bngrid@outlook.com',
      token: generateToken(),
      status: 'active',
      role: 'super'
    }
  })
  console.log('超级管理员已添加：', user)
  return prisma
}

main()
  .catch(async e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
