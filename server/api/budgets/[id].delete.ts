export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    await prisma.budget.delete({ where: { id } })
    return { success: true }
  } catch {
    return { success: true }
  }
})
