export function useAccounts(userId: Ref<string | null>) {
  const accounts = ref<any[]>([])
  const isLoading = ref(false)

  const fetchAccounts = async () => {
    if (!userId.value) return
    isLoading.value = true
    try {
      const data = await $fetch('/api/accounts', {
        query: { userId: userId.value },
      })
      accounts.value = (data as any).accounts
    } catch {
      accounts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const totalBalance = computed(() =>
    accounts.value.reduce((sum, a) => {
      if (a.type === 'credit') return sum - (a.balanceCurrent ?? 0)
      return sum + (a.balanceCurrent ?? 0)
    }, 0)
  )

  const hasAccounts = computed(() => accounts.value.length > 0)

  watch(userId, () => {
    if (userId.value) fetchAccounts()
  }, { immediate: true })

  return {
    accounts: readonly(accounts),
    isLoading: readonly(isLoading),
    totalBalance,
    hasAccounts,
    fetchAccounts,
  }
}
