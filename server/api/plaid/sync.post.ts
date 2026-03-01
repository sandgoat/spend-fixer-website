import type { RemovedTransaction, Transaction as PlaidTransaction } from 'plaid'
import { decrypt } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body || {}

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const plaidItems = await prisma.plaidItem.findMany({
    where: { userId },
    include: { accounts: true },
  })

  if (!plaidItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'No linked accounts found' })
  }

  const client = getPlaidClient()
  const forceRefresh = body.refresh !== false
  let totalAdded = 0
  let totalModified = 0
  let totalRemoved = 0

  for (const item of plaidItems) {
    // Decrypt access token stored at rest with AES-256-GCM
    const accessToken = decrypt(item.accessToken)

    if (forceRefresh) {
      try {
        await client.transactionsRefresh({ access_token: accessToken })
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch {
        // Refresh may fail on sandbox or if not enabled — continue with sync
      }
    }

    let hasMore = true
    let cursor = item.cursor ?? undefined

    while (hasMore) {
      const response = await client.transactionsSync({
        access_token: accessToken,
        cursor,
      })

      const { added, modified, removed, next_cursor, has_more } = response.data

      const accountMap = new Map(
        item.accounts.map((a) => [a.plaidAccountId, a.id])
      )

      if (added.length > 0) {
        await upsertTransactions(added, accountMap, userId)
        totalAdded += added.length
      }

      if (modified.length > 0) {
        await upsertTransactions(modified, accountMap, userId)
        totalModified += modified.length
      }

      if (removed.length > 0) {
        await removeTransactions(removed)
        totalRemoved += removed.length
      }

      cursor = next_cursor
      hasMore = has_more
    }

    await prisma.plaidItem.update({
      where: { id: item.id },
      data: { cursor },
    })

    for (const account of item.accounts) {
      const balanceResponse = await client.accountsGet({
        access_token: accessToken,
        options: { account_ids: [account.plaidAccountId] },
      })

      const updatedAccount = balanceResponse.data.accounts[0]
      if (updatedAccount) {
        await prisma.account.update({
          where: { id: account.id },
          data: {
            balanceCurrent: updatedAccount.balances.current,
            balanceAvailable: updatedAccount.balances.available,
            lastSync: new Date(),
          },
        })
      }
    }
  }

  return { success: true, added: totalAdded, modified: totalModified, removed: totalRemoved }
})

async function upsertTransactions(
  transactions: PlaidTransaction[],
  accountMap: Map<string, string>,
  userId: string
) {
  for (const tx of transactions) {
    const accountId = accountMap.get(tx.account_id)
    if (!accountId) continue

    await prisma.transaction.upsert({
      where: { plaidTransactionId: tx.transaction_id },
      create: {
        userId,
        accountId,
        plaidTransactionId: tx.transaction_id,
        date: new Date(tx.date),
        merchant: tx.merchant_name ?? null,
        name: tx.name,
        amount: tx.amount,
        category: tx.personal_finance_category?.primary ?? null,
        categoryDetail: tx.personal_finance_category?.detailed ?? null,
        pending: tx.pending,
        isoCurrencyCode: tx.iso_currency_code,
      },
      update: {
        date: new Date(tx.date),
        merchant: tx.merchant_name ?? null,
        name: tx.name,
        amount: tx.amount,
        category: tx.personal_finance_category?.primary ?? null,
        categoryDetail: tx.personal_finance_category?.detailed ?? null,
        pending: tx.pending,
      },
    })
  }
}

async function removeTransactions(removed: RemovedTransaction[]) {
  const ids = removed
    .map((r) => r.transaction_id)
    .filter((id): id is string => !!id)

  if (ids.length > 0) {
    await prisma.transaction.deleteMany({
      where: { plaidTransactionId: { in: ids } },
    })
  }
}
