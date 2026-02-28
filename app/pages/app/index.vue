<script setup lang="ts">
definePageMeta({ layout: 'app' })
useSeoMeta({ title: 'Dashboard — SpendFixer', robots: 'noindex, nofollow' })
useHead({ link: [{ rel: 'canonical', href: 'https://spendfixer.com/app' }] })

const userStore = useUserStore()
const userId = computed(() => userStore.user?.id ?? null)

const { accounts, hasAccounts, fetchAccounts } = useAccounts(userId)
const { openPlaidLink, isLinking } = usePlaid()

const summary = ref<any>(null)
const recentTransactions = ref<any[]>([])
const isLoading = ref(true)
const isDemo = ref(false)

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const demoSummary = {
  spentToday: 109.47,
  spentThisWeek: 487.23,
  spentThisMonth: 2419,
  netWorth: 18420.55,
  categoryBreakdown: [
    { category: 'FOOD_AND_DRINK', total: 462, count: 18 },
    { category: 'TRANSPORTATION', total: 284, count: 8 },
    { category: 'ENTERTAINMENT', total: 189, count: 5 },
    { category: 'GENERAL_MERCHANDISE', total: 156, count: 7 },
    { category: 'PERSONAL_CARE', total: 85, count: 3 },
  ],
}

const demoTransactions = [
  { id: '1', merchant: 'Whole Foods Market', name: 'Whole Foods', category: 'FOOD_AND_DRINK', amount: 67.32, date: new Date().toISOString(), pending: false },
  { id: '2', merchant: 'Shell Gas Station', name: 'Shell', category: 'TRANSPORTATION', amount: 42.15, date: new Date().toISOString(), pending: false },
  { id: '3', merchant: 'Netflix', name: 'Netflix', category: 'ENTERTAINMENT', amount: 15.99, date: new Date(Date.now() - 86400000).toISOString(), pending: false },
  { id: '4', merchant: 'Starbucks', name: 'Starbucks', category: 'FOOD_AND_DRINK', amount: 6.45, date: new Date(Date.now() - 86400000).toISOString(), pending: false },
  { id: '5', merchant: 'Amazon', name: 'Amazon', category: 'GENERAL_MERCHANDISE', amount: 29.99, date: new Date(Date.now() - 86400000).toISOString(), pending: true },
]

const fetchDashboardData = async () => {
  if (!userId.value) return
  isLoading.value = true
  try {
    const [summaryData, txData] = await Promise.all([
      $fetch('/api/transactions/summary', { query: { userId: userId.value } }),
      $fetch('/api/transactions', { query: { userId: userId.value, limit: 5 } }),
    ])
    summary.value = summaryData
    recentTransactions.value = (txData as any).transactions
    isDemo.value = false
  } catch {
    summary.value = demoSummary
    recentTransactions.value = demoTransactions
    isDemo.value = true
  } finally {
    isLoading.value = false
  }
}

const handleConnectBank = () => {
  if (!userId.value) return
  openPlaidLink(userId.value, async () => {
    await fetchAccounts()
    await fetchDashboardData()
  })
}

const formatAmount = (amount: number) => `-$${Math.abs(amount).toFixed(2)}`

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const categoryLabel = (category: string | null) => {
  if (!category) return 'Uncategorized'
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

watch(userId, () => {
  if (userId.value) fetchDashboardData()
}, { immediate: true })
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="font-display text-2xl font-bold text-brand-950">{{ greeting }}!</h1>
      <p class="mt-1 text-sm text-gray-500">{{ today }} — Here's what to fix today</p>
    </div>

    <!-- Daily Digest hero card -->
    <DailyDigest
      class="mb-8"
      :transactions="recentTransactions"
      :summary="summary"
      :user-name="userStore.user?.name ?? ''"
      :is-loading="isLoading"
    />

    <div v-if="isDemo" class="mb-6 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-5 py-3">
      <p class="text-sm text-brand-700">
        <strong>Demo mode</strong> — connect your bank to see real data
      </p>
      <button
        :disabled="isLinking"
        class="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
        @click="handleConnectBank"
      >
        Connect Bank
      </button>
    </div>

    <template v-if="summary">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5">
          <p class="text-sm font-medium text-gray-500">Spent Today</p>
          <p class="mt-1 font-display text-2xl font-bold text-brand-950">${{ summary.spentToday.toFixed(2) }}</p>
          <p class="mt-1 text-xs text-brand-600">↓ 18% vs. avg</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5">
          <p class="text-sm font-medium text-gray-500">This Week</p>
          <p class="mt-1 font-display text-2xl font-bold text-brand-950">${{ summary.spentThisWeek.toFixed(2) }}</p>
          <p class="mt-1 text-xs text-gray-400">Budget: $650/week</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5">
          <p class="text-sm font-medium text-gray-500">This Month</p>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-medium text-gray-700">${{ summary.spentThisMonth.toLocaleString() }} / $3,200</span>
              <span class="font-semibold text-brand-600">{{ Math.round(summary.spentThisMonth / 3200 * 100) }}%</span>
            </div>
            <div class="mt-1.5 h-2.5 rounded-full bg-gray-100">
              <div
                class="h-full rounded-full bg-brand-500 transition-all"
                :style="{ width: `${Math.min(summary.spentThisMonth / 3200 * 100, 100)}%` }"
              />
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5">
          <p class="text-sm font-medium text-gray-500">Net Worth</p>
          <p class="mt-1 font-display text-2xl font-bold text-brand-950">
            ${{ summary.netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </p>
          <p class="mt-1 text-xs text-brand-600">↑ $340 this month</p>
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
          <p class="text-sm text-red-800">
            <strong>Fix:</strong> You haven't used Hulu in 47 days — that's $15.99/mo going nowhere.
          </p>
          <button class="ml-4 shrink-0 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white">Cancel</button>
        </div>
        <div class="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm text-amber-800">
            <strong>Watch:</strong> Dining is $462 this month — 40% above your average. Cook a few nights to get back on track.
          </p>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 class="font-display text-lg font-bold text-brand-950">Recent Transactions</h2>
          <div v-if="recentTransactions.length > 0" class="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ tx.merchant || tx.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ categoryLabel(tx.category) }} · {{ formatDate(tx.date) }}
                  <span v-if="tx.pending" class="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pending</span>
                </p>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {{ formatAmount(tx.amount) }}
              </span>
            </div>
          </div>
          <NuxtLink
            to="/app/transactions"
            class="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all transactions →
          </NuxtLink>
        </div>

        <div>
          <h2 class="font-display text-lg font-bold text-brand-950">Spending by Category</h2>
          <div class="mt-4 space-y-4 rounded-xl border border-gray-200 bg-white p-5">
            <div v-for="(cat, i) in summary.categoryBreakdown.slice(0, 6)" :key="cat.category">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">{{ categoryLabel(cat.category) }}</span>
                <span class="text-xs font-medium text-gray-500">
                  ${{ cat.total.toFixed(2) }}
                </span>
              </div>
              <div class="mt-1.5 h-2 rounded-full bg-gray-100">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="[
                    i === 0 ? 'bg-brand-600' : '',
                    i === 1 ? 'bg-brand-500' : '',
                    i === 2 ? 'bg-brand-400' : '',
                    i === 3 ? 'bg-brand-300' : '',
                    i >= 4 ? 'bg-brand-200' : '',
                  ]"
                  :style="{ width: `${Math.min((cat.total / (summary.categoryBreakdown[0]?.total || 1)) * 100, 100)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="isLoading" class="flex justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  </div>
</template>
