import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

let plaidClient: PlaidApi | null = null

export function getPlaidClient(): PlaidApi {
  if (plaidClient) return plaidClient

  const config = useRuntimeConfig()

  const configuration = new Configuration({
    basePath: PlaidEnvironments[config.plaidEnv as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.plaidClientId,
        'PLAID-SECRET': config.plaidSecret,
      },
    },
  })

  plaidClient = new PlaidApi(configuration)
  return plaidClient
}
