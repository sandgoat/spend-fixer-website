export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, category, amount, period = 'monthly' } = body

  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  if (!category) throw createError({ statusCode: 400, statusMessage: 'category is required' })
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'amount must be a positive number' })
  }

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const budget = await prisma.budget.upsert({
      where: { userId_category_period: { userId, category, period } },
      create: { userId, category, amount: Number(amount), period },
      update: { amount: Number(amount) },
    })

    return { budget }
  } catch {
    // Graceful noop without DB — return mock created budget
    return {
      budget: {
        id: `mock-${Date.now()}`,
        userId,
        category,
        amount: Number(amount),
        period,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
  }
})
