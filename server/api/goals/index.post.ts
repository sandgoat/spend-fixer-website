export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, name, emoji, targetAmount, deadline } = body

  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  if (!name || !name.trim()) throw createError({ statusCode: 400, statusMessage: 'name is required' })
  if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'targetAmount must be a positive number' })
  }

  const goalData = {
    userId,
    name: name.trim(),
    emoji: emoji || '🎯',
    targetAmount: Number(targetAmount),
    savedAmount: 0,
    deadline: deadline || null,
    progressHistory: [],
  }

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const goal = await (prisma as any).goal.create({ data: goalData })
    return { goal }
  } catch {
    return {
      goal: {
        id: `mock-${Date.now()}`,
        ...goalData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
  }
})
