export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })

  return { accounts }
})
