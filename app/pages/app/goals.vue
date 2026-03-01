<script setup lang="ts">
definePageMeta({ layout: 'app' })
useSeoMeta({ title: 'Goals — SpendFixer', robots: 'noindex, nofollow' })
useHead({ link: [{ rel: 'canonical', href: 'https://spendfixer.com/app/goals' }] })

const userStore = useUserStore()
const userId = computed(() => userStore.user?.id ?? null)

// ── Goal types ────────────────────────────────────────────────
const GOAL_TYPES = [
  { label: 'Emergency Fund', emoji: '🛡️', hint: '3–6 months expenses' },
  { label: 'Vacation', emoji: '✈️', hint: 'Plan your next trip' },
  { label: 'New Car', emoji: '🚗', hint: 'Down payment or full price' },
  { label: 'Pay Off Debt', emoji: '💳', hint: 'Credit cards, loans' },
  { label: 'Home Down Payment', emoji: '🏡', hint: 'Save for your future home' },
  { label: 'Custom', emoji: '🎯', hint: 'Name it yourself' },
]

// ── Interfaces ────────────────────────────────────────────────
interface ProgressEntry {
  amount: number
  date: string
}

interface Goal {
  id: string
  userId: string
  name: string
  emoji: string
  targetAmount: number
  savedAmount: number
  deadline?: string | null
  progressHistory: ProgressEntry[]
  createdAt: string
  updatedAt: string
}

// ── State ─────────────────────────────────────────────────────
const goals = ref<Goal[]>([])
const isLoading = ref(false)

// Milestone tracking (celebrate once per goal per threshold)
const celebratedMilestones = ref<Record<string, number[]>>({})

// Create modal
const showCreateModal = ref(false)
const isCustomName = ref(false)
const createForm = reactive({
  selectedType: '',
  customName: '',
  emoji: '🎯',
  targetAmount: '',
  deadline: '',
})
const createErrors = reactive({ name: '', amount: '' })
const isSaving = ref(false)

// Progress modal
const showProgressModal = ref(false)
const progressGoal = ref<Goal | null>(null)
const progressAmount = ref('')
const progressError = ref('')

// Milestone celebration
const celebrationGoal = ref<Goal | null>(null)
const celebrationMilestone = ref(0)
const showCelebration = ref(false)

// ── Data fetching ─────────────────────────────────────────────
const fetchGoals = async () => {
  if (!userId.value) return
  isLoading.value = true
  try {
    const res = await $fetch<{ goals: Goal[] }>('/api/goals', {
      query: { userId: userId.value },
    })
    goals.value = res.goals
  } catch {
    goals.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchGoals)

// ── Computed cards ────────────────────────────────────────────
const goalCards = computed(() =>
  goals.value.map((g) => {
    const pct = g.targetAmount > 0 ? Math.min((g.savedAmount / g.targetAmount) * 100, 100) : 0
    const remaining = Math.max(g.targetAmount - g.savedAmount, 0)

    // Monthly savings rate from history (last 2 months)
    const history = g.progressHistory || []
    let monthlyRate = 0
    if (history.length >= 2) {
      const now = new Date()
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      const recent = history.filter((p) => new Date(p.date) >= twoMonthsAgo)
      if (recent.length > 0) {
        const total = recent.reduce((s, p) => s + p.amount, 0)
        monthlyRate = total / 2
      }
    } else if (history.length === 1) {
      monthlyRate = history[0].amount
    }

    // Projected completion
    let projectedDate: string | null = null
    if (monthlyRate > 0 && remaining > 0) {
      const monthsNeeded = remaining / monthlyRate
      const proj = new Date()
      proj.setMonth(proj.getMonth() + Math.ceil(monthsNeeded))
      projectedDate = proj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else if (remaining <= 0) {
      projectedDate = 'Complete!'
    }

    // On track vs behind
    let trackStatus: 'on-track' | 'behind' | 'complete' | null = null
    if (g.deadline && remaining > 0) {
      const deadline = new Date(g.deadline)
      const now = new Date()
      const monthsLeft = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth())
      if (monthsLeft > 0) {
        const requiredMonthly = remaining / monthsLeft
        trackStatus = monthlyRate >= requiredMonthly ? 'on-track' : 'behind'
      } else {
        trackStatus = remaining > 0 ? 'behind' : 'complete'
      }
    } else if (remaining <= 0) {
      trackStatus = 'complete'
    }

    // SVG ring params
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (pct / 100) * circumference

    return {
      ...g,
      pct,
      remaining,
      monthlyRate,
      projectedDate,
      trackStatus,
      radius,
      circumference,
      strokeDashoffset,
    }
  })
)

const totalTarget = computed(() => goals.value.reduce((s, g) => s + g.targetAmount, 0))
const totalSaved = computed(() => goals.value.reduce((s, g) => s + g.savedAmount, 0))

// ── Milestone detection ───────────────────────────────────────
const MILESTONES = [25, 50, 75, 100]

const checkMilestones = (goal: Goal, prevSaved: number) => {
  const prevPct = goal.targetAmount > 0 ? (prevSaved / goal.targetAmount) * 100 : 0
  const newPct = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0
  const celebrated = celebratedMilestones.value[goal.id] || []

  for (const m of MILESTONES) {
    if (prevPct < m && newPct >= m && !celebrated.includes(m)) {
      celebratedMilestones.value[goal.id] = [...celebrated, m]
      celebrationGoal.value = goal
      celebrationMilestone.value = m
      showCelebration.value = true
      setTimeout(() => { showCelebration.value = false }, 4000)
      break
    }
  }
}

// ── Create goal ───────────────────────────────────────────────
const openCreate = () => {
  createForm.selectedType = ''
  createForm.customName = ''
  createForm.emoji = '🎯'
  createForm.targetAmount = ''
  createForm.deadline = ''
  isCustomName.value = false
  createErrors.name = ''
  createErrors.amount = ''
  showCreateModal.value = true
}

const selectType = (type: typeof GOAL_TYPES[0]) => {
  createForm.selectedType = type.label
  if (type.label === 'Custom') {
    isCustomName.value = true
    createForm.customName = ''
    createForm.emoji = '🎯'
  } else {
    isCustomName.value = false
    createForm.emoji = type.emoji
  }
  createErrors.name = ''
}

const goalName = computed(() =>
  createForm.selectedType === 'Custom' ? createForm.customName : createForm.selectedType
)

const validateCreate = () => {
  let ok = true
  createErrors.name = ''
  createErrors.amount = ''
  if (!goalName.value.trim()) {
    createErrors.name = 'Goal name is required'
    ok = false
  }
  if (!createForm.targetAmount || isNaN(Number(createForm.targetAmount)) || Number(createForm.targetAmount) <= 0) {
    createErrors.amount = 'Enter a positive target amount'
    ok = false
  }
  return ok
}

const submitCreate = async () => {
  if (!validateCreate() || !userId.value) return
  isSaving.value = true
  try {
    const res = await $fetch<{ goal: Goal }>('/api/goals', {
      method: 'POST',
      body: {
        userId: userId.value,
        name: goalName.value.trim(),
        emoji: createForm.emoji,
        targetAmount: Number(createForm.targetAmount),
        deadline: createForm.deadline || null,
      },
    })
    goals.value = [...goals.value, res.goal]
    showCreateModal.value = false
  } catch {
    createErrors.amount = 'Failed to save — try again'
  } finally {
    isSaving.value = false
  }
}

// ── Add progress ──────────────────────────────────────────────
const openProgress = (goal: Goal) => {
  progressGoal.value = goal
  progressAmount.value = ''
  progressError.value = ''
  showProgressModal.value = false
  nextTick(() => { showProgressModal.value = true })
}

const submitProgress = async () => {
  if (!progressGoal.value || !userId.value) return
  const amt = Number(progressAmount.value)
  if (isNaN(amt) || amt <= 0) {
    progressError.value = 'Enter a positive amount'
    return
  }
  isSaving.value = true
  const prevSaved = progressGoal.value.savedAmount
  try {
    await $fetch(`/api/goals/${progressGoal.value.id}`, {
      method: 'PUT',
      body: { userId: userId.value, addAmount: amt },
    })
    // Update local state
    const idx = goals.value.findIndex((g) => g.id === progressGoal.value!.id)
    if (idx !== -1) {
      const updated = {
        ...goals.value[idx],
        savedAmount: goals.value[idx].savedAmount + amt,
        progressHistory: [
          ...(goals.value[idx].progressHistory || []),
          { amount: amt, date: new Date().toISOString() },
        ],
      }
      goals.value.splice(idx, 1, updated)
      checkMilestones(updated, prevSaved)
    }
    showProgressModal.value = false
  } catch {
    progressError.value = 'Failed to save — try again'
  } finally {
    isSaving.value = false
  }
}

// ── Delete goal ───────────────────────────────────────────────
const deleteGoal = async (id: string) => {
  if (!userId.value || !confirm('Delete this goal?')) return
  try {
    await $fetch(`/api/goals/${id}`, {
      method: 'DELETE',
      query: { userId: userId.value },
    })
    goals.value = goals.value.filter((g) => g.id !== id)
  } catch {}
}

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const fmtDeadline = (d?: string | null) => {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const milestoneEmoji = (m: number) => m === 100 ? '🏆' : m === 75 ? '🌟' : m === 50 ? '🎉' : '✨'
const milestoneLabel = (m: number) => m === 100 ? 'Goal complete!' : `${m}% there!`

const ringColor = (pct: number) =>
  pct >= 100 ? '#22c55e' : pct >= 75 ? '#3b82f6' : pct >= 50 ? '#8b5cf6' : '#f59e0b'
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-brand-950">Goals</h1>
        <p class="mt-1 text-sm text-gray-500">Track your savings targets</p>
      </div>
      <button
        class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 self-start sm:self-auto"
        @click="openCreate"
      >
        + Add Goal
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="mt-12 flex justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>

    <template v-else>
      <!-- Summary row -->
      <div v-if="goals.length > 0" class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Total Target</p>
          <p class="mt-1 text-xl font-bold text-gray-900">{{ fmt(totalTarget) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Total Saved</p>
          <p class="mt-1 text-xl font-bold text-brand-600">{{ fmt(totalSaved) }}</p>
        </div>
        <div class="col-span-2 sm:col-span-1 rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Still Needed</p>
          <p class="mt-1 text-xl font-bold text-gray-900">{{ fmt(Math.max(totalTarget - totalSaved, 0)) }}</p>
        </div>
      </div>

      <!-- Goal cards grid -->
      <div v-if="goals.length > 0" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="card in goalCards"
          :key="card.id"
          class="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <!-- Delete button -->
          <div class="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Delete"
              @click="deleteGoal(card.id)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Card content -->
          <div class="flex items-start gap-4">
            <!-- SVG progress ring -->
            <div class="relative flex-shrink-0">
              <svg class="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <!-- Track -->
                <circle cx="50" cy="50" :r="card.radius" fill="none" stroke="#f3f4f6" stroke-width="10" />
                <!-- Progress -->
                <circle
                  cx="50" cy="50"
                  :r="card.radius"
                  fill="none"
                  :stroke="ringColor(card.pct)"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="card.circumference"
                  :stroke-dashoffset="card.strokeDashoffset"
                  class="transition-all duration-700"
                />
              </svg>
              <!-- Center text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl leading-none">{{ card.emoji }}</span>
                <span class="mt-0.5 text-xs font-bold text-gray-700">{{ Math.round(card.pct) }}%</span>
              </div>
            </div>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-gray-900 truncate">{{ card.name }}</h3>

              <div class="mt-2 space-y-1 text-xs text-gray-500">
                <div class="flex justify-between">
                  <span>Saved</span>
                  <span class="font-medium text-gray-900">{{ fmt(card.savedAmount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Remaining</span>
                  <span class="font-medium text-gray-900">{{ fmt(card.remaining) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Target</span>
                  <span class="font-medium text-gray-900">{{ fmt(card.targetAmount) }}</span>
                </div>
              </div>

              <!-- Deadline / track status -->
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-if="card.trackStatus === 'on-track'"
                  class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                >
                  ✅ On track
                </span>
                <span
                  v-else-if="card.trackStatus === 'behind'"
                  class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                >
                  ⚠️ Behind
                </span>
                <span
                  v-else-if="card.trackStatus === 'complete'"
                  class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                >
                  🏆 Complete!
                </span>

                <span
                  v-if="card.deadline && card.trackStatus !== 'complete'"
                  class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  📅 {{ fmtDeadline(card.deadline) }}
                </span>
              </div>

              <!-- Projected completion -->
              <p v-if="card.projectedDate && card.trackStatus !== 'complete'" class="mt-1.5 text-xs text-gray-400">
                Projected: {{ card.projectedDate }}
              </p>
            </div>
          </div>

          <!-- Add Progress button -->
          <button
            v-if="card.pct < 100"
            class="mt-4 w-full rounded-xl border border-brand-200 bg-brand-50 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
            @click="openProgress(card)"
          >
            + Add Progress
          </button>
          <div
            v-else
            class="mt-4 w-full rounded-xl bg-green-100 py-2 text-center text-sm font-semibold text-green-700"
          >
            🎉 Goal Reached!
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-8 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
        <div class="text-center px-4">
          <p class="text-4xl">🎯</p>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-950">Set your first savings goal</h3>
          <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Pick a target, set a deadline, and we'll track every dollar.
          </p>
          <!-- Suggested types -->
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <button
              v-for="type in GOAL_TYPES.slice(0, 5)"
              :key="type.label"
              class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
              @click="openCreate"
            >
              <span>{{ type.emoji }}</span>
              <span>{{ type.label }}</span>
            </button>
          </div>
          <button
            class="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            @click="openCreate"
          >
            Create a Goal
          </button>
        </div>
      </div>
    </template>

    <!-- ── Milestone celebration toast ── -->
    <Teleport to="body">
      <Transition name="celebration">
        <div
          v-if="showCelebration && celebrationGoal"
          class="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-white px-8 py-5 shadow-2xl border border-gray-200 text-center min-w-[260px]"
        >
          <div class="text-4xl animate-bounce">{{ milestoneEmoji(celebrationMilestone) }}</div>
          <p class="mt-2 font-display text-lg font-bold text-brand-950">{{ milestoneLabel(celebrationMilestone) }}</p>
          <p class="text-sm text-gray-500">{{ celebrationGoal.emoji }} {{ celebrationGoal.name }}</p>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Create Goal Modal ── -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showCreateModal = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-brand-950">New Goal</h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="showCreateModal = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-5 space-y-5">
            <!-- Goal type picker -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">Type</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="type in GOAL_TYPES"
                  :key="type.label"
                  class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all"
                  :class="
                    createForm.selectedType === type.label
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  "
                  @click="selectType(type)"
                >
                  <span class="text-base">{{ type.emoji }}</span>
                  <div class="min-w-0">
                    <p class="font-medium leading-tight">{{ type.label }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ type.hint }}</p>
                  </div>
                </button>
              </div>
              <p v-if="createErrors.name && !createForm.selectedType" class="mt-1 text-xs text-red-600">{{ createErrors.name }}</p>
            </div>

            <!-- Custom name input -->
            <div v-if="isCustomName">
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Goal Name</label>
              <div class="flex gap-2">
                <input
                  v-model="createForm.emoji"
                  type="text"
                  maxlength="2"
                  placeholder="🎯"
                  class="w-14 rounded-xl border border-gray-300 py-2.5 text-center text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <input
                  v-model="createForm.customName"
                  type="text"
                  placeholder="My savings goal"
                  class="flex-1 rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  :class="{ 'border-red-400': createErrors.name && isCustomName }"
                />
              </div>
              <p v-if="createErrors.name && isCustomName" class="mt-1 text-xs text-red-600">{{ createErrors.name }}</p>
            </div>

            <!-- Target amount -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Target Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  v-model="createForm.targetAmount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="10,000"
                  class="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  :class="{ 'border-red-400': createErrors.amount }"
                />
              </div>
              <p v-if="createErrors.amount" class="mt-1 text-xs text-red-600">{{ createErrors.amount }}</p>
            </div>

            <!-- Deadline (optional) -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">
                Deadline <span class="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                v-model="createForm.deadline"
                type="date"
                class="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
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
              {{ isSaving ? 'Saving...' : 'Create Goal' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Add Progress Modal ── -->
    <Teleport to="body">
      <div
        v-if="showProgressModal && progressGoal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="showProgressModal = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-brand-950">
              {{ progressGoal.emoji }} Add Progress
            </h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="showProgressModal = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p class="mt-1 text-sm text-gray-500">
            {{ progressGoal.name }} — {{ fmt(progressGoal.savedAmount) }} of {{ fmt(progressGoal.targetAmount) }} saved
          </p>

          <!-- Mini progress bar -->
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full bg-brand-500 transition-all"
              :style="{ width: `${Math.min((progressGoal.savedAmount / progressGoal.targetAmount) * 100, 100)}%` }"
            />
          </div>

          <div class="mt-5">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Amount to Add</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                v-model="progressAmount"
                type="number"
                min="1"
                step="1"
                placeholder="500"
                autofocus
                class="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                :class="{ 'border-red-400': progressError }"
                @keyup.enter="submitProgress"
              />
            </div>
            <p v-if="progressError" class="mt-1 text-xs text-red-600">{{ progressError }}</p>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showProgressModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="isSaving"
              class="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              @click="submitProgress"
            >
              {{ isSaving ? 'Saving...' : 'Add Savings' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.celebration-enter-active {
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.celebration-leave-active {
  animation: pop-in 0.3s ease-in reverse;
}
@keyframes pop-in {
  from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
}
</style>
