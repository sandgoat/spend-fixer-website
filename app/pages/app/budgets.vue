<script setup lang="ts">
definePageMeta({ layout: 'app' })
useSeoMeta({ title: 'Budgets — SpendFixer', robots: 'noindex, nofollow' })
useHead({ link: [{ rel: 'canonical', href: 'https://spendfixer.com/app/budgets' }] })

const userStore = useUserStore()
const userId = computed(() => userStore.user?.id ?? null)

// ── Category config ──────────────────────────────────────────
const CATEGORIES = [
  { value: 'Food', label: 'Food & Dining', emoji: '🍔' },
  { value: 'Transport', label: 'Transport', emoji: '🚗' },
  { value: 'Entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'Shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'Bills', label: 'Bills & Utilities', emoji: '💡' },
  { value: 'Health', label: 'Health', emoji: '❤️' },
  { value: 'Other', label: 'Other', emoji: '📦' },
]

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]))

const getCategoryEmoji = (cat: string) => categoryMap[cat]?.emoji ?? '📦'
const getCategoryLabel = (cat: string) => categoryMap[cat]?.label ?? cat

// ── Mock transactions for demo / no-DB mode ──────────────────
const MOCK_TRANSACTIONS = [
  { category: 'Food', amount: 52.4, date: '2026-02-20' },
  { category: 'Food', amount: 38.9, date: '2026-02-14' },
  { category: 'Food', amount: 71.2, date: '2026-02-08' },
  { category: 'Food', amount: 49.0, date: '2026-01-22' },
  { category: 'Food', amount: 63.5, date: '2026-01-10' },
  { category: 'Transport', amount: 45.0, date: '2026-02-18' },
  { category: 'Transport', amount: 38.0, date: '2026-01-18' },
  { category: 'Entertainment', amount: 14.99, date: '2026-02-01' },
  { category: 'Entertainment', amount: 29.99, date: '2026-02-15' },
  { category: 'Entertainment', amount: 14.99, date: '2026-01-01' },
  { category: 'Shopping', amount: 87.6, date: '2026-02-12' },
  { category: 'Shopping', amount: 122.4, date: '2026-01-14' },
  { category: 'Bills', amount: 95.0, date: '2026-02-01' },
  { category: 'Bills', amount: 95.0, date: '2026-01-01' },
  { category: 'Health', amount: 30.0, date: '2026-02-10' },
]

// ── State ─────────────────────────────────────────────────────
interface Budget {
  id: string
  category: string
  amount: number
  period: string
  createdAt: string
  updatedAt: string
}

const budgets = ref<Budget[]>([])
const isLoading = ref(false)

// Modal state
const showCreateModal = ref(false)
const showSuggestModal = ref(false)
const showEditModal = ref(false)
const editingBudget = ref<Budget | null>(null)

// Create form
const form = reactive({ category: '', amount: '', emoji: '' })
const formErrors = reactive({ category: '', amount: '' })
const isSaving = ref(false)

// Edit form
const editAmount = ref('')
const editError = ref('')

// Suggestions
interface Suggestion {
  category: string
  avgMonthly: number
  suggested: number
  selected: boolean
}
const suggestions = ref<Suggestion[]>([])

// ── Data fetching ─────────────────────────────────────────────
const fetchBudgets = async () => {
  if (!userId.value) return
  isLoading.value = true
  try {
    const res = await $fetch<{ budgets: Budget[] }>('/api/budgets', {
      query: { userId: userId.value },
    })
    budgets.value = res.budgets
  } catch {
    budgets.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBudgets)

// ── Transaction data (real or mock) ──────────────────────────
const transactions = ref<{ category: string; amount: number; date: string }[]>([])

const fetchTransactions = async () => {
  if (!userId.value) return
  try {
    const res = await $fetch<{ transactions: any[] }>('/api/transactions', {
      query: { userId: userId.value, limit: 100 },
    })
    if (res.transactions && res.transactions.length > 0) {
      transactions.value = res.transactions.map((t) => ({
        category: t.category ?? 'Other',
        amount: Math.abs(t.amount),
        date: typeof t.date === 'string' ? t.date : new Date(t.date).toISOString().slice(0, 10),
      }))
    } else {
      transactions.value = MOCK_TRANSACTIONS
    }
  } catch {
    transactions.value = MOCK_TRANSACTIONS
  }
}

onMounted(fetchTransactions)

// ── Spending calculations ─────────────────────────────────────
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() // 0-indexed

const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
const daysRemaining = daysInMonth - now.getDate()

const currentMonthSpend = computed(() => {
  const map: Record<string, number> = {}
  for (const t of transactions.value) {
    const d = new Date(t.date)
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      map[t.category] = (map[t.category] ?? 0) + t.amount
    }
  }
  return map
})

const budgetCards = computed(() =>
  budgets.value.map((b) => {
    const spent = currentMonthSpend.value[b.category] ?? 0
    const pct = Math.min((spent / b.amount) * 100, 100)
    const remaining = Math.max(b.amount - spent, 0)
    const color = pct >= 90 ? 'red' : pct >= 70 ? 'yellow' : 'green'
    return { ...b, spent, pct, remaining, color }
  })
)

const totalBudgeted = computed(() => budgets.value.reduce((s, b) => s + b.amount, 0))
const totalSpent = computed(() =>
  budgetCards.value.reduce((s, c) => s + c.spent, 0)
)
const totalRemaining = computed(() => Math.max(totalBudgeted.value - totalSpent.value, 0))

// ── Create budget ─────────────────────────────────────────────
const openCreate = () => {
  form.category = ''
  form.amount = ''
  form.emoji = ''
  formErrors.category = ''
  formErrors.amount = ''
  showCreateModal.value = true
}

const validateForm = () => {
  let ok = true
  formErrors.category = ''
  formErrors.amount = ''
  if (!form.category) { formErrors.category = 'Please pick a category'; ok = false }
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    formErrors.amount = 'Enter a positive dollar amount'
    ok = false
  }
  return ok
}

const submitCreate = async () => {
  if (!validateForm() || !userId.value) return
  isSaving.value = true
  try {
    await $fetch('/api/budgets', {
      method: 'POST',
      body: { userId: userId.value, category: form.category, amount: Number(form.amount) },
    })
    showCreateModal.value = false
    await fetchBudgets()
  } catch {
    formErrors.amount = 'Failed to save — try again'
  } finally {
    isSaving.value = false
  }
}

// ── Edit budget ───────────────────────────────────────────────
const openEdit = (budget: Budget) => {
  editingBudget.value = budget
  editAmount.value = String(budget.amount)
  editError.value = ''
  showEditModal.value = true
}

const submitEdit = async () => {
  if (!editingBudget.value || !userId.value) return
  const amt = Number(editAmount.value)
  if (isNaN(amt) || amt <= 0) { editError.value = 'Enter a positive dollar amount'; return }
  isSaving.value = true
  try {
    await $fetch(`/api/budgets/${editingBudget.value.id}`, {
      method: 'PUT',
      body: { userId: userId.value, amount: amt },
    })
    showEditModal.value = false
    await fetchBudgets()
  } catch {
    editError.value = 'Failed to save — try again'
  } finally {
    isSaving.value = false
  }
}

// ── Delete budget ─────────────────────────────────────────────
const deleteBudget = async (id: string) => {
  if (!userId.value || !confirm('Delete this budget?')) return
  try {
    await $fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
      query: { userId: userId.value },
    })
    await fetchBudgets()
  } catch {}
}

// ── Auto-suggest ──────────────────────────────────────────────
const buildSuggestions = () => {
  const monthlySpend: Record<string, Record<string, number>> = {}

  for (const t of transactions.value) {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const cat = t.category
    if (!monthlySpend[cat]) monthlySpend[cat] = {}
    monthlySpend[cat][key] = (monthlySpend[cat][key] ?? 0) + t.amount
  }

  const result: Suggestion[] = []
  for (const [cat, months] of Object.entries(monthlySpend)) {
    const vals = Object.values(months)
    if (vals.length === 0) continue
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const suggested = Math.ceil(avg * 1.1)
    // Only suggest if no budget exists for this category
    if (!budgets.value.find((b) => b.category === cat)) {
      result.push({ category: cat, avgMonthly: avg, suggested, selected: true })
    }
  }

  suggestions.value = result.sort((a, b) => b.avgMonthly - a.avgMonthly)
  showSuggestModal.value = true
}

const acceptSelected = async () => {
  if (!userId.value) return
  isSaving.value = true
  try {
    const selected = suggestions.value.filter((s) => s.selected)
    await Promise.all(
      selected.map((s) =>
        $fetch('/api/budgets', {
          method: 'POST',
          body: { userId: userId.value, category: s.category, amount: s.suggested },
        })
      )
    )
    showSuggestModal.value = false
    await fetchBudgets()
  } catch {} finally {
    isSaving.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const barColor = (color: string) =>
  color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-amber-400' : 'bg-brand-500'

const textColor = (color: string) =>
  color === 'red' ? 'text-red-600' : color === 'yellow' ? 'text-amber-600' : 'text-brand-600'
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-brand-950">Budgets</h1>
        <p class="mt-1 text-sm text-gray-500">Track spending by category</p>
      </div>
      <div class="flex gap-3">
        <button
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          @click="buildSuggestions"
        >
          ✨ Suggest Budgets
        </button>
        <button
          class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          @click="openCreate"
        >
          + New Budget
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="mt-12 flex justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>

    <template v-else>
      <!-- Summary row -->
      <div v-if="budgets.length > 0" class="mt-6 grid grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Total Budgeted</p>
          <p class="mt-1 text-xl font-bold text-gray-900">{{ fmt(totalBudgeted) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Spent This Month</p>
          <p class="mt-1 text-xl font-bold text-gray-900">{{ fmt(totalSpent) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Remaining</p>
          <p class="mt-1 text-xl font-bold" :class="totalRemaining > 0 ? 'text-brand-600' : 'text-red-600'">
            {{ fmt(totalRemaining) }}
          </p>
        </div>
      </div>

      <!-- Budget cards grid -->
      <div v-if="budgets.length > 0" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="card in budgetCards"
          :key="card.id"
          class="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <!-- Actions -->
          <div class="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Edit"
              @click="openEdit(card)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Delete"
              @click="deleteBudget(card.id)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Category -->
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ getCategoryEmoji(card.category) }}</span>
            <div>
              <p class="font-semibold text-gray-900">{{ getCategoryLabel(card.category) }}</p>
              <p class="text-xs text-gray-400">{{ daysRemaining }} days left this month</p>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>{{ Math.round(card.pct) }}% used</span>
              <span :class="textColor(card.color)" class="font-medium">
                {{ fmt(card.remaining) }} left
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="barColor(card.color)"
                :style="{ width: `${card.pct}%` }"
              />
            </div>
          </div>

          <!-- Amounts -->
          <div class="mt-3 flex justify-between text-sm">
            <span class="text-gray-500">Spent: <span class="font-medium text-gray-900">{{ fmt(card.spent) }}</span></span>
            <span class="text-gray-500">Limit: <span class="font-medium text-gray-900">{{ fmt(card.amount) }}</span></span>
          </div>

          <!-- Over budget warning -->
          <p v-if="card.pct >= 100" class="mt-2 text-xs font-medium text-red-600">
            ⚠️ Over budget by {{ fmt(card.spent - card.amount) }}
          </p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-8 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
        <div class="text-center">
          <p class="text-4xl">🎯</p>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-950">Set up your first budget</h3>
          <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Track spending by category and stay on top of your money every month.
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              @click="buildSuggestions"
            >
              ✨ Suggest from history
            </button>
            <button
              class="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              @click="openCreate"
            >
              Add your first budget
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ── Create Budget Modal ── -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showCreateModal = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-brand-950">New Budget</h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="showCreateModal = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-5 space-y-4">
            <!-- Category picker -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="cat in CATEGORIES"
                  :key="cat.value"
                  class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all"
                  :class="
                    form.category === cat.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  "
                  @click="form.category = cat.value"
                >
                  <span>{{ cat.emoji }}</span>
                  <span>{{ cat.label }}</span>
                </button>
              </div>
              <p v-if="formErrors.category" class="mt-1 text-xs text-red-600">{{ formErrors.category }}</p>
            </div>

            <!-- Amount -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Monthly Limit</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  v-model="form.amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="500"
                  class="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  :class="{ 'border-red-400': formErrors.amount }"
                />
              </div>
              <p v-if="formErrors.amount" class="mt-1 text-xs text-red-600">{{ formErrors.amount }}</p>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="isSaving"
              class="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              @click="submitCreate"
            >
              {{ isSaving ? 'Saving...' : 'Create Budget' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Edit Budget Modal ── -->
    <Teleport to="body">
      <div
        v-if="showEditModal && editingBudget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showEditModal = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-brand-950">
              {{ getCategoryEmoji(editingBudget.category) }} Edit {{ getCategoryLabel(editingBudget.category) }}
            </h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="showEditModal = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-5">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Monthly Limit</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                v-model="editAmount"
                type="number"
                min="1"
                step="1"
                class="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                :class="{ 'border-red-400': editError }"
              />
            </div>
            <p v-if="editError" class="mt-1 text-xs text-red-600">{{ editError }}</p>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showEditModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="isSaving"
              class="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              @click="submitEdit"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Suggest Budgets Modal ── -->
    <Teleport to="body">
      <div
        v-if="showSuggestModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showSuggestModal = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-brand-950">✨ Budget Suggestions</h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="showSuggestModal = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">Based on your spending history + a 10% buffer.</p>

          <div v-if="suggestions.length === 0" class="mt-6 py-6 text-center text-sm text-gray-500">
            All categories already have budgets set.
          </div>

          <div v-else class="mt-4 space-y-3 max-h-72 overflow-y-auto">
            <label
              v-for="s in suggestions"
              :key="s.category"
              class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all"
              :class="s.selected ? 'border-brand-400 bg-brand-50' : 'border-gray-200'"
            >
              <input v-model="s.selected" type="checkbox" class="rounded border-gray-300 text-brand-600" />
              <span class="text-xl">{{ getCategoryEmoji(s.category) }}</span>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ getCategoryLabel(s.category) }}</p>
                <p class="text-xs text-gray-500">avg {{ fmt(s.avgMonthly) }}/mo</p>
              </div>
              <span class="text-sm font-semibold text-brand-700">{{ fmt(s.suggested) }}/mo</span>
            </label>
          </div>

          <div v-if="suggestions.length > 0" class="mt-5 flex gap-3">
            <button
              class="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showSuggestModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="isSaving || suggestions.every((s) => !s.selected)"
              class="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              @click="acceptSelected"
            >
              {{ isSaving ? 'Saving...' : 'Accept Selected' }}
            </button>
          </div>
          <div v-else class="mt-5">
            <button
              class="w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showSuggestModal = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
