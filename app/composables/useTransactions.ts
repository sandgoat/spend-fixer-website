export function useTransactions(userId: Ref<string | null>) {
  const transactions = ref<any[]>([])
  const isLoading = ref(false)
  const pagination = ref({ page: 1, limit: 50, total: 0, pages: 0 })
  const filters = ref({ category: '', accountId: '' })

  const fetchTransactions = async (page = 1) => {
    if (!userId.value) return
    isLoading.value = true
    try {
      const query: Record<string, string | number> = {
        userId: userId.value,
        page,
        limit: pagination.value.limit,
      }
      if (filters.value.category) query.category = filters.value.category
      if (filters.value.accountId) query.accountId = filters.value.accountId

      const data = await $fetch('/api/transactions', { query })
      const result = data as any
      transactions.value = result.transactions
      pagination.value = result.pagination
    } catch {
      transactions.value = []
    } finally {
      isLoading.value = false
    }
  }

  const syncTransactions = async () => {
    if (!userId.value) return
    isLoading.value = true
    try {
      await $fetch('/api/plaid/sync', {
        method: 'POST',
        body: { userId: userId.value },
      })
      await fetchTransactions()
    } finally {
      isLoading.value = false
    }
  }

  watch(userId, () => {
    if (userId.value) fetchTransactions()
  }, { immediate: true })

  return {
    transactions: readonly(transactions),
    isLoading: readonly(isLoading),
    pagination: readonly(pagination),
    filters,
    fetchTransactions,
    syncTransactions,
  }
}
