<script setup lang="ts">
import type { Transaction, Budget } from '~/types'
import type { SpendingAlert } from '~/composables/useSpendingAlerts'

interface Props {
  transactions?: Transaction[]
  budgets?: Budget[]
  summary?: {
    spentToday: number
    spentThisMonth: number
    monthlyBudget?: number
    categoryBreakdown?: { category: string; total: number; count: number }[]
  } | null
  userName?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  transactions: () => [],
  budgets: () => [],
  summary: null,
  userName: '',
  isLoading: false,
})

// Mock data for graceful fallback
const mockSummary = {
  spentToday: 109.47,
  dailyAverage: 82.30,
  spentThisMonth: 2419,
  monthlyBudget: 3200,
  categoryBreakdown: [
    { category: 'FOOD_AND_DRINK', total: 462, count: 18 },
    { category: 'TRANSPORTATION', total: 284, count: 8 },
    { category: 'ENTERTAINMENT', total: 189, count: 5 },
  ],
}

const mockTransactions: Transaction[] = [
  { id: 'm1', accountId: '', date: new Date().toISOString(), merchant: 'Whole Foods Market', amount: 67.32, category: 'FOOD_AND_DRINK', pending: false },
  { id: 'm2', accountId: '', date: new Date().toISOString(), merchant: 'Shell', amount: 42.15, category: 'TRANSPORTATION', pending: false },
]

const mockBudgets: Budget[] = [
  { id: 'b1', userId: '', category: 'FOOD_AND_DRINK', limit: 500, spent: 462, period: 'monthly' },
  { id: 'b2', userId: '', category: 'TRANSPORTATION', limit: 300, spent: 284, period: 'monthly' },
]

// Use real or mock data
const effectiveTransactions = computed<Transaction[]>(() =>
  props.transactions.length > 0 ? props.transactions : mockTransactions,
)
const effectiveBudgets = computed<Budget[]>(() =>
  props.budgets.length > 0 ? props.budgets : mockBudgets,
)

const { alerts, dismissAlert } = useSpendingAlerts(effectiveTransactions, effectiveBudgets)

// Derived summary stats
const now = new Date()
const todayStr = now.toISOString().slice(0, 10)

const spentToday = computed(() => {
  if (props.summary) return props.summary.spentToday
  return effectiveTransactions.value
    .filter(t => t.date?.slice(0, 10) === todayStr && t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)
})

const dailyAverage = computed(() => {
  if (props.summary) return 82.30 // fallback until API returns it
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentTxs = effectiveTransactions.value.filter(t => new Date(t.date) >= thirtyDaysAgo && t.amount > 0)
  if (!recentTxs.length) return 0
  const byDay: Record<string, number> = {}
  recentTxs.forEach(t => {
    const day = t.date?.slice(0, 10)
    if (day) byDay[day] = (byDay[day] || 0) + t.amount
  })
  const vals = Object.values(byDay)
  return vals.reduce((s, v) => s + v, 0) / Math.max(vals.length, 1)
})

const spentThisMonth = computed(() => props.summary?.spentThisMonth ?? mockSummary.spentThisMonth)
const monthlyBudget = computed(() => props.summary?.monthlyBudget ?? mockSummary.monthlyBudget)
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
const daysLeft = computed(() => daysInMonth - now.getDate())
const budgetRemaining = computed(() => Math.max(0, monthlyBudget.value - spentThisMonth.value))
const monthPct = computed(() => Math.min(Math.round((spentThisMonth.value / monthlyBudget.value) * 100), 100))

const todayUnderAvg = computed(() => spentToday.value <= dailyAverage.value)

const topCategoryToday = computed(() => {
  const todayTxs = effectiveTransactions.value.filter(t => t.date?.slice(0, 10) === todayStr && t.amount > 0)
  if (!todayTxs.length) return null
  const byCategory: Record<string, number> = {}
  todayTxs.forEach(t => {
    const cat = t.category || 'OTHER'
    byCategory[cat] = (byCategory[cat] || 0) + t.amount
  })
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
  return top ? { category: top[0], total: top[1] } : null
})

const categoryLabel = (cat: string) =>
  cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const greeting = computed(() => {
  const hour = now.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const greetingName = computed(() =>
  props.userName ? `, ${props.userName.split(' ')[0]}` : '',
)

const severityClass = (severity: SpendingAlert['severity']) => ({
  info: 'border-brand-200 bg-brand-50 text-brand-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
}[severity])

const severityIcon = (severity: SpendingAlert['severity']) => ({
  info: '💡',
  warning: '⚠️',
  danger: '🚨',
}[severity])

const alertTypeLabel = (type: SpendingAlert['type']) => ({
  unusual_spike: 'Spike',
  budget_warning: 'Budget',
  budget_exceeded: 'Over Budget',
  recurring_charge: 'Subscription',
  large_transaction: 'Large Charge',
}[type])
</script>

<template>
  <!-- Skeleton loader -->
  <div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
    <div class="h-5 w-48 rounded bg-gray-200 mb-4" />
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-xl bg-gray-100 h-24" />
    </div>
    <div class="mt-4 h-16 rounded-xl bg-gray-100" />
  </div>

  <!-- Daily Digest card -->
  <div v-else class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 pt-6 pb-4 border-b border-gray-100">
      <h2 class="font-display text-xl font-bold text-brand-950">
        {{ greeting }}{{ greetingName }} 👋
      </h2>
      <p class="text-sm text-gray-500 mt-0.5">Here's your daily snapshot</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
      <!-- Today -->
      <div class="bg-white px-5 py-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Today</p>
        <p class="mt-1 font-display text-2xl font-bold text-brand-950">${{ spentToday.toFixed(2) }}</p>
        <p
          class="mt-1 text-xs font-medium"
          :class="todayUnderAvg ? 'text-emerald-600' : 'text-red-500'"
        >
          <span v-if="todayUnderAvg">✓ Under avg (${{ dailyAverage.toFixed(0) }})</span>
          <span v-else>↑ Above avg (${{ dailyAverage.toFixed(0) }})</span>
        </p>
      </div>

      <!-- This Month -->
      <div class="bg-white px-5 py-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">This Month</p>
        <p class="mt-1 font-display text-2xl font-bold text-brand-950">${{ spentThisMonth.toLocaleString() }}</p>
        <div class="mt-1.5">
          <div class="h-1.5 rounded-full bg-gray-100">
            <div
              class="h-full rounded-full transition-all"
              :class="monthPct >= 100 ? 'bg-red-500' : monthPct >= 80 ? 'bg-amber-400' : 'bg-brand-500'"
              :style="{ width: `${monthPct}%` }"
            />
          </div>
          <p class="mt-1 text-xs text-gray-400">{{ monthPct }}% of ${{ monthlyBudget.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Budget Remaining -->
      <div class="bg-white px-5 py-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Remaining</p>
        <p
          class="mt-1 font-display text-2xl font-bold"
          :class="budgetRemaining === 0 ? 'text-red-600' : 'text-emerald-600'"
        >
          ${{ budgetRemaining.toLocaleString() }}
        </p>
        <p class="mt-1 text-xs text-gray-400">{{ daysLeft }} days left</p>
      </div>

      <!-- Top Category Today -->
      <div class="bg-white px-5 py-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Top Category</p>
        <template v-if="topCategoryToday">
          <p class="mt-1 font-display text-base font-bold text-brand-950 leading-tight">
            {{ categoryLabel(topCategoryToday.category) }}
          </p>
          <p class="mt-1 text-xs text-gray-400">${{ topCategoryToday.total.toFixed(2) }} today</p>
        </template>
        <p v-else class="mt-1 text-sm text-gray-400">No spending yet</p>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="alerts.length > 0" class="px-6 py-4 space-y-2 border-t border-gray-100">
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Alerts</p>
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
        :class="severityClass(alert.severity)"
      >
        <div class="flex items-start gap-2 min-w-0">
          <span class="shrink-0 mt-0.5">{{ severityIcon(alert.severity) }}</span>
          <div class="min-w-0">
            <span class="font-semibold mr-1">{{ alertTypeLabel(alert.type) }}:</span>
            <span>{{ alert.message }}</span>
          </div>
        </div>
        <button
          v-if="alert.dismissible"
          class="shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity mt-0.5"
          aria-label="Dismiss"
          @click="dismissAlert(alert.id)"
        >
          ✕
        </button>
      </div>
    </div>
    <div v-else class="px-6 py-4 border-t border-gray-100">
      <p class="text-sm text-emerald-600 font-medium">✓ No alerts — you're on track today!</p>
    </div>
  </div>
</template>
