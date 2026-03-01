const MOCK_GOALS = [
  {
    id: 'mock-1',
    userId: 'demo',
    name: 'Emergency Fund',
    emoji: '🛡️',
    targetAmount: 15000,
    savedAmount: 4200,
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
    progressHistory: [
      { amount: 2000, date: '2026-01-15T00:00:00.000Z' },
      { amount: 2200, date: '2026-02-15T00:00:00.000Z' },
    ],
  },
  {
    id: 'mock-2',
    userId: 'demo',
    name: 'Hawaii Vacation',
    emoji: '🌺',
    targetAmount: 5000,
    savedAmount: 1750,
    deadline: '2026-08-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-20T00:00:00.000Z',
    progressHistory: [
      { amount: 750, date: '2026-01-20T00:00:00.000Z' },
      { amount: 1000, date: '2026-02-20T00:00:00.000Z' },
    ],
  },
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  try {
    const { getPrisma } = await import('../../utils/prisma')
    const prisma = getPrisma()

    const goals = await (prisma as any).goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })

    return { goals }
  } catch {
    return { goals: MOCK_GOALS.filter((g) => g.userId === 'demo' || g.userId === userId) }
  }
})
