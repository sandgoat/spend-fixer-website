<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Transactions' })

const userStore = useUserStore()
const userId = computed(() => userStore.user?.id ?? null)

const { accounts, hasAccounts, fetchAccounts } = useAccounts(userId)
const { transactions, isLoading, pagination, filters, fetchTransactions, syncTransactions } = useTransactions(userId)
const { openPlaidLink, isLinking } = usePlaid()

const isSyncing = ref(false)

const handleSync = async () => {
  isSyncing.value = true
  await syncTransactions()
  await fetchAccounts()
  isSyncing.value = false
}

const handleConnectBank = () => {
  if (!userId.value) return
  openPlaidLink(userId.value, async () => {
    await fetchAccounts()
    await fetchTransactions()
  })
}

const formatAmount = (amount: number) => {
  const isNegative = amount < 0
  return `${isNegative ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const categoryLabel = (category: string | null) => {
  if (!category) return 'Uncategorized'
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const categories = computed(() => {
  const cats = new Set(transactions.value.map((t: any) => t.category).filter(Boolean))
  return Array.from(cats).sort()
})
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-brand-950">Transactions</h1>
        <p class="mt-1 text-sm text-gray-500">All your transactions in one place</p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="hasAccounts"
          :disabled="isSyncing"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          @click="handleSync"
        >
          {{ isSyncing ? 'Syncing...' : 'Sync Now' }}
        </button>
        <button
          :disabled="isLinking"
          class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          @click="handleConnectBank"
        >
          {{ isLinking ? 'Connecting...' : '+ Connect Bank' }}
        </button>
      </div>
    </div>

    <template v-if="!hasAccounts && !isLoading">
      <div class="mt-8 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
        <div class="text-center">
          <p class="text-4xl">🏦</p>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-950">Connect your bank</h3>
          <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Link your bank account to see all your transactions auto-categorized and ready to go.
          </p>
          <button
            :disabled="isLinking"
            class="mt-6 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            @click="handleConnectBank"
          >
            {{ isLinking ? 'Connecting...' : 'Connect with Plaid' }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="accounts.length > 0" class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="rounded-xl border border-gray-200 bg-white p-4"
        >
          <p class="text-sm font-medium text-gray-500">{{ account.name }}</p>
          <p class="mt-1 text-xl font-bold text-gray-900">
            ${{ (account.balanceCurrent ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </p>
          <p class="mt-1 text-xs text-gray-400">{{ account.type }} · Synced {{ formatDate(account.lastSync) }}</p>
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          v-model="filters.category"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          @change="fetchTransactions(1)"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ categoryLabel(cat) }}
          </option>
        </select>
        <select
          v-model="filters.accountId"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          @change="fetchTransactions(1)"
        >
          <option value="">All Accounts</option>
          <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
            {{ acc.name }}
          </option>
        </select>
      </div>

      <div v-if="isLoading" class="mt-8 flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>

      <div v-else-if="transactions.length === 0" class="mt-8 rounded-xl border border-gray-200 bg-white py-16 text-center">
        <p class="text-sm text-gray-500">No transactions yet. Tap "Sync Now" to pull the latest.</p>
      </div>

      <div v-else class="mt-6">
        <div class="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="flex items-center justify-between px-5 py-4"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900">{{ tx.merchant || tx.name }}</p>
              <p class="text-xs text-gray-500">
                {{ categoryLabel(tx.category) }} · {{ tx.account?.name }} · {{ formatDate(tx.date) }}
                <span v-if="tx.pending" class="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">Pending</span>
              </p>
            </div>
            <span
              class="ml-4 text-sm font-semibold"
              :class="tx.amount < 0 ? 'text-brand-600' : 'text-gray-900'"
            >
              {{ formatAmount(tx.amount) }}
            </span>
          </div>
        </div>

        <div v-if="pagination.pages > 1" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-gray-500">
            Page {{ pagination.page }} of {{ pagination.pages }} ({{ pagination.total }} transactions)
          </p>
          <div class="flex gap-2">
            <button
              :disabled="pagination.page <= 1"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
              @click="fetchTransactions(pagination.page - 1)"
            >
              Previous
            </button>
            <button
              :disabled="pagination.page >= pagination.pages"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
              @click="fetchTransactions(pagination.page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
