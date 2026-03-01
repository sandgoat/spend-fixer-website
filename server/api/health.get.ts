import { getPrisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const prisma = getPrisma()
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, db: 'connected' }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
})
