export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [monthlyTransactions, weeklyTransactions, todayTransactions, categoryBreakdown] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, date: { gte: startOfMonth }, amount: { gt: 0 } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { userId, date: { gte: startOfWeek }, amount: { gt: 0 } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, date: { gte: today }, amount: { gt: 0 } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['category'],
      where: { userId, date: { gte: startOfMonth }, amount: { gt: 0 } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    }),
  ])

  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { balanceCurrent: true, type: true },
  })

  const netWorth = accounts.reduce((sum, a) => {
    if (a.type === 'credit') return sum - (a.balanceCurrent ?? 0)
    return sum + (a.balanceCurrent ?? 0)
  }, 0)

  return {
    spentToday: todayTransactions._sum.amount ?? 0,
    spentThisWeek: weeklyTransactions._sum.amount ?? 0,
    spentThisMonth: monthlyTransactions._sum.amount ?? 0,
    transactionCount: monthlyTransactions._count,
    netWorth,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category ?? 'Uncategorized',
      total: c._sum.amount ?? 0,
      count: c._count,
    })),
  }
})
