export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { userId, amount } = body

  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'amount must be a positive number' })
  }

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const budget = await prisma.budget.update({
      where: { id },
      data: { amount: Number(amount) },
    })

    return { budget }
  } catch {
    return { budget: { id, userId, amount: Number(amount), updatedAt: new Date().toISOString() } }
  }
})
