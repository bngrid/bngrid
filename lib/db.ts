import { PrismaClient } from '@/generated/prisma'

type Global = typeof globalThis & {
  prisma?: PrismaClient
}

const globalWithPrisma = <Global>global
const db = globalWithPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalWithPrisma.prisma = db

export default db
