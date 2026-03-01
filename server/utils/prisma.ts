import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }
  if (!globalForPrisma.prisma) {
    // Prisma 7 reads DATABASE_URL from environment automatically
    // when using the config file (prisma.config.ts)
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// Lazy getter for backward compat
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop]
  },
})
