import { decrypt } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const plaidItems = await prisma.plaidItem.findMany({
    where: { userId },
    include: { accounts: true },
  })

  if (!plaidItems.length) {
    return { inflow: [], outflow: [] }
  }

  const client = getPlaidClient()
  const allInflow: any[] = []
  const allOutflow: any[] = []

  for (const item of plaidItems) {
    try {
      const accountIds = item.accounts.map((a) => a.plaidAccountId)
      // Decrypt access token stored at rest with AES-256-GCM
      const accessToken = decrypt(item.accessToken)

      const response = await client.transactionsRecurringGet({
        access_token: accessToken,
        account_ids: accountIds,
      })

      allInflow.push(
        ...response.data.inflow_streams.map((stream) => ({
          id: stream.stream_id,
          merchantName: stream.merchant_name || stream.description,
          amount: Math.abs(stream.last_amount.amount ?? 0),
          frequency: stream.frequency,
          lastDate: stream.last_date,
          nextDate: stream.predicted_next_date,
          status: stream.status,
          isActive: stream.is_active,
          category: stream.personal_finance_category?.primary ?? null,
        }))
      )

      allOutflow.push(
        ...response.data.outflow_streams.map((stream) => ({
          id: stream.stream_id,
          merchantName: stream.merchant_name || stream.description,
          amount: Math.abs(stream.last_amount.amount ?? 0),
          frequency: stream.frequency,
          lastDate: stream.last_date,
          nextDate: stream.predicted_next_date,
          status: stream.status,
          isActive: stream.is_active,
          category: stream.personal_finance_category?.primary ?? null,
        }))
      )
    } catch {
      // Recurring transactions may not be available for all items
    }
  }

  const totalMonthlyOutflow = allOutflow
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.amount, 0)

  return {
    inflow: allInflow,
    outflow: allOutflow,
    totalMonthlyOutflow,
  }
})
