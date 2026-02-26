import { CountryCode, Products } from 'plaid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = body?.userId

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  }

  const client = getPlaidClient()

  const response = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'SpendFixer',
    products: [Products.Transactions],
    additional_consented_products: [Products.RecurringTransactions],
    country_codes: [CountryCode.Us],
    language: 'en',
  })

  return { linkToken: response.data.link_token }
})
