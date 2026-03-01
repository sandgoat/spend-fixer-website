import { encrypt } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { publicToken, userId } = body || {}

  if (!publicToken || !userId) {
    throw createError({ statusCode: 400, statusMessage: 'publicToken and userId are required' })
  }

  const client = getPlaidClient()

  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: publicToken,
  })

  const { access_token: accessToken, item_id: itemId } = exchangeResponse.data

  // Encrypt the access token before persisting to DB (AES-256-GCM)
  const encryptedAccessToken = encrypt(accessToken)

  const plaidItem = await prisma.plaidItem.create({
    data: {
      userId,
      accessToken: encryptedAccessToken,
      itemId,
    },
  })

  const accountsResponse = await client.accountsGet({ access_token: accessToken })

  const accounts = await Promise.all(
    accountsResponse.data.accounts.map((account) =>
      prisma.account.create({
        data: {
          userId,
          plaidItemId: plaidItem.id,
          plaidAccountId: account.account_id,
          name: account.name,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype ?? null,
          balanceCurrent: account.balances.current,
          balanceAvailable: account.balances.available,
          isoCurrencyCode: account.balances.iso_currency_code,
        },
      })
    )
  )

  return { success: true, accounts }
})
