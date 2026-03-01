<script setup lang="ts">
definePageMeta({ layout: 'app' })

const MOCK_SUBSCRIPTIONS = [
  { id: 1, name: 'Netflix', emoji: '🎬', amount: 15.99, frequency: 'monthly', lastCharged: '2026-02-01', nextCharge: '2026-03-01', status: 'active', category: 'Entertainment' },
  { id: 2, name: 'Spotify', emoji: '🎵', amount: 9.99, frequency: 'monthly', lastCharged: '2026-02-05', nextCharge: '2026-03-05', status: 'active', category: 'Entertainment' },
  { id: 3, name: 'Amazon Prime', emoji: '📦', amount: 14.99, frequency: 'monthly', lastCharged: '2026-02-10', nextCharge: '2026-03-10', status: 'active', category: 'Shopping' },
  { id: 4, name: 'Gym Membership', emoji: '💪', amount: 45.00, frequency: 'monthly', lastCharged: '2026-02-01', nextCharge: '2026-03-01', status: 'active', category: 'Health' },
  { id: 5, name: 'Adobe Creative Cloud', emoji: '🎨', amount: 54.99, frequency: 'monthly', lastCharged: '2026-02-15', nextCharge: '2026-03-15', status: 'active', category: 'Software' },
  { id: 6, name: 'iCloud Storage', emoji: '☁️', amount: 2.99, frequency: 'monthly', lastCharged: '2026-02-20', nextCharge: '2026-03-20', status: 'active', category: 'Software' },
  { id: 7, name: 'Hulu', emoji: '📺', amount: 17.99, frequency: 'monthly', lastCharged: '2026-02-08', nextCharge: '2026-03-08', status: 'paused', category: 'Entertainment' },
  { id: 8, name: 'ChatGPT Plus', emoji: '🤖', amount: 20.00, frequency: 'monthly', lastCharged: '2026-02-12', nextCharge: '2026-03-12', status: 'active', category: 'Software' },
]

type Status = 'active' | 'paused' | 'cancelled'
type SortOption = 'amount' | 'nextCharge' | 'recentlyAdded'

interface Subscription {
  id: number
  name: string
  emoji: string
  amount: number
  frequency: string
  lastCharged: string
  nextCharge: string
  status: Status
  category: string
}

const subscriptions = ref<Subscription[]>([])
const loading = ref(true)
const sortBy = ref<SortOption>('amount')
const filterStatus = ref<Status | 'all'>('all')
const watchingIds = ref<Set<number>>(new Set())
const usedIds = ref<Set<number>>(new Set())

onMounted(async () => {
  try {
    const data = await $fetch('/api/plaid/recurring')
    if (data && Array.isArray(data) && data.length > 0) {
      subscriptions.value = data as Subscription[]
    } else {
      subscriptions.value = MOCK_SUBSCRIPTIONS
    }
  } catch {
    subscriptions.value = MOCK_SUBSCRIPTIONS
  }
  loading.value = false
})

const activeSubscriptions = computed(() =>
  subscriptions.value.filter(s => s.status === 'active')
)

const totalMonthly = computed(() =>
  activeSubscriptions.value.reduce((sum, s) => sum + s.amount, 0)
)

const totalAnnual = computed(() => totalMonthly.value * 12)

const unusedSubscriptions = computed(() =>
  activeSubscriptions.value.filter(s => !usedIds.value.has(s.id))
)

const unusedTotal = computed(() =>
  unusedSubscriptions.value.reduce((sum, s) => sum + s.amount, 0)
)

const filteredAndSorted = computed(() => {
  let list = [...subscriptions.value]

  if (filterStatus.value !== 'all') {
    list = list.filter(s => s.status === filterStatus.value)
  }

  if (sortBy.value === 'amount') {
    list.sort((a, b) => b.amount - a.amount)
  } else if (sortBy.value === 'nextCharge') {
    list.sort((a, b) => new Date(a.nextCharge).getTime() - new Date(b.nextCharge).getTime())
  }
  // recentlyAdded: keep original order

  return list
})

function toggleWatching(id: number) {
  if (watchingIds.value.has(id)) {
    watchingIds.value.delete(id)
  } else {
    watchingIds.value.add(id)
  }
}

function toggleUsed(id: number) {
  if (usedIds.value.has(id)) {
    usedIds.value.delete(id)
  } else {
    usedIds.value.add(id)
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

const statusColors: Record<Status, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-gray-100 text-gray-500',
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="font-display text-2xl font-bold text-gray-900">Subscriptions</h1>
      <p class="mt-1 text-sm text-gray-500">Track and manage your recurring charges</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>

    <template v-else>
      <!-- 2.7.7 Insight banner -->
      <div class="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-brand-100 text-sm font-medium">Monthly subscription spend</p>
            <p class="mt-1 font-display text-4xl font-bold">{{ formatCurrency(totalMonthly) }}<span class="text-xl font-normal text-brand-200">/mo</span></p>
            <p class="mt-1 text-brand-200 text-sm">That's <span class="font-semibold text-white">{{ formatCurrency(totalAnnual) }}/year</span> going to subscriptions</p>
          </div>
          <div v-if="unusedTotal > 0" class="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p class="text-sm font-medium text-brand-100">Savings potential</p>
            <p class="font-display text-2xl font-bold">{{ formatCurrency(unusedTotal) }}<span class="text-sm font-normal text-brand-200">/mo</span></p>
            <p class="text-xs text-brand-200">by canceling unused subs</p>
          </div>
        </div>

        <!-- Used this month prompt -->
        <div class="mt-5 border-t border-white/20 pt-5">
          <p class="text-sm font-semibold text-white">Which ones have you actually used this month?</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="sub in activeSubscriptions"
              :key="sub.id"
              class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              :class="usedIds.has(sub.id)
                ? 'bg-white text-brand-700 shadow'
                : 'bg-white/15 text-white hover:bg-white/25'"
              @click="toggleUsed(sub.id)"
            >
              <span>{{ sub.emoji }}</span>
              <span>{{ sub.name }}</span>
              <span v-if="usedIds.has(sub.id)" class="text-green-600">✓</span>
            </button>
          </div>
          <p v-if="unusedTotal > 0" class="mt-3 text-xs text-brand-200">
            {{ unusedSubscriptions.length }} subscription{{ unusedSubscriptions.length !== 1 ? 's' : '' }} unused — canceling could save {{ formatCurrency(unusedTotal) }}/month
          </p>
        </div>
      </div>

      <!-- Filters & sort -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex gap-2">
          <button
            v-for="opt in [['all', 'All'], ['active', 'Active'], ['paused', 'Paused'], ['cancelled', 'Cancelled']]"
            :key="opt[0]"
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="filterStatus === opt[0]
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="filterStatus = opt[0] as any"
          >
            {{ opt[1] }}
          </button>
        </div>
        <select
          v-model="sortBy"
          class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="amount">Sort: Highest Cost</option>
          <option value="nextCharge">Sort: Next Charge</option>
          <option value="recentlyAdded">Sort: Recently Added</option>
        </select>
      </div>

      <!-- Subscription cards -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="sub in filteredAndSorted"
          :key="sub.id"
          class="relative rounded-2xl border bg-white p-5 shadow-sm transition-all"
          :class="[
            sub.status === 'active' && !usedIds.has(sub.id) && usedIds.size > 0
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-200',
            watchingIds.has(sub.id) ? 'ring-2 ring-brand-400' : '',
          ]"
        >
          <!-- Unused badge -->
          <div
            v-if="sub.status === 'active' && !usedIds.has(sub.id) && usedIds.size > 0"
            class="absolute right-3 top-3 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-yellow-900"
          >
            Consider canceling
          </div>

          <div class="flex items-start gap-4">
            <!-- Emoji logo -->
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              {{ sub.emoji }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 truncate">{{ sub.name }}</h3>
                <span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize" :class="statusColors[sub.status as Status]">
                  {{ sub.status }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">{{ sub.category }}</p>
            </div>
          </div>

          <div class="mt-4 flex items-end justify-between">
            <div>
              <p class="font-display text-2xl font-bold text-gray-900">{{ formatCurrency(sub.amount) }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ sub.frequency }}</p>
            </div>
            <div class="text-right text-xs text-gray-400 space-y-0.5">
              <p>Last: <span class="text-gray-600">{{ formatDate(sub.lastCharged) }}</span></p>
              <p>Next: <span class="font-medium text-gray-800">{{ formatDate(sub.nextCharge) }}</span></p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
            <button
              class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              :class="watchingIds.has(sub.id)
                ? 'bg-brand-100 text-brand-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              @click="toggleWatching(sub.id)"
            >
              {{ watchingIds.has(sub.id) ? '👁️ Watching' : '👁 Watch' }}
            </button>
            <button
              class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              :class="usedIds.has(sub.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
              @click="toggleUsed(sub.id)"
            >
              {{ usedIds.has(sub.id) ? '✓ Used' : 'Mark used' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredAndSorted.length === 0" class="rounded-2xl bg-gray-50 py-16 text-center">
        <p class="text-4xl">🔍</p>
        <p class="mt-3 font-semibold text-gray-700">No subscriptions found</p>
        <p class="text-sm text-gray-400">Try a different filter</p>
      </div>
    </template>
  </div>
</template>
