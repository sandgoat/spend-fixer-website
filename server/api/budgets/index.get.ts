export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })

    return { budgets }
  } catch {
    return { budgets: [] }
  }
})
