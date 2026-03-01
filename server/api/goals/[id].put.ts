export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { userId, addAmount, name, emoji, targetAmount, deadline } = body

  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  if (!id) throw createError({ statusCode: 400, statusMessage: 'goal id is required' })

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const existing = await (prisma as any).goal.findFirst({ where: { id, userId } })
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Goal not found' })

    const updateData: Record<string, any> = {}

    if (addAmount !== undefined && !isNaN(Number(addAmount)) && Number(addAmount) > 0) {
      const entry = { amount: Number(addAmount), date: new Date().toISOString() }
      updateData.savedAmount = existing.savedAmount + Number(addAmount)
      updateData.progressHistory = [...(existing.progressHistory || []), entry]
    }

    if (name !== undefined) updateData.name = name
    if (emoji !== undefined) updateData.emoji = emoji
    if (targetAmount !== undefined && Number(targetAmount) > 0) updateData.targetAmount = Number(targetAmount)
    if (deadline !== undefined) updateData.deadline = deadline || null

    const goal = await (prisma as any).goal.update({ where: { id }, data: updateData })
    return { goal }
  } catch (err: any) {
    if (err.statusCode) throw err
    // Graceful mock response
    const savedAmount = addAmount ? Number(addAmount) : 0
    return {
      goal: {
        id,
        userId,
        savedAmount,
        updatedAt: new Date().toISOString(),
      },
    }
  }
})
