export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  const page = parseInt(query.page as string) || 1
  const limit = Math.min(parseInt(query.limit as string) || 50, 100)
  const category = query.category as string | undefined
  const accountId = query.accountId as string | undefined

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const where: Record<string, unknown> = { userId }
  if (category) where.category = category
  if (accountId) where.accountId = accountId

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { account: { select: { name: true, type: true } } },
    }),
    prisma.transaction.count({ where }),
  ])

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
})
