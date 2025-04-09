import { PrismaClient } from '@/generated/prisma'

type GlobalType = typeof globalThis & {
  prisma?: PrismaClient
}

const globalWithPrisma = <GlobalType>global

const db = globalWithPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = db
}

export default db
