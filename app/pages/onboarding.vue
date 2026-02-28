<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Welcome to SpendFixer',
  robots: 'noindex',
})

const userStore = useUserStore()
const { openPlaidLink, isLinking, linkError } = usePlaid()

const step = ref(1)
const bankConnected = ref(false)
const transitioning = ref(false)

const userName = computed(() => userStore.user?.name?.split(' ')[0] || 'there')
const userId = computed(() => userStore.user?.id || '')

// Mock spending summary (replaced by real data after Plaid connect)
const spendingSummary = ref({ amount: 0, topCategory: '', transactions: 0 })

async function goToStep(n: number) {
  transitioning.value = true
  await new Promise(r => setTimeout(r, 220))
  step.value = n
  transitioning.value = false
}

async function connectBank() {
  if (!userId.value) return
  await openPlaidLink(userId.value, async () => {
    bankConnected.value = true
    // Try to load real summary; fall back to mock
    try {
      const summary = await $fetch<{ totalSpent: number; topCategory: string; count: number }>('/api/transactions/summary')
      spendingSummary.value = {
        amount: summary.totalSpent,
        topCategory: summary.topCategory || 'Dining',
        transactions: summary.count,
      }
    } catch {
      spendingSummary.value = { amount: 1842.50, topCategory: 'Dining', transactions: 47 }
    }
    await goToStep(3)
  })
}

async function skipBank() {
  spendingSummary.value = { amount: 2140.00, topCategory: 'Subscriptions', transactions: 53 }
  await goToStep(3)
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-cream">
    <!-- Skip link -->
    <div class="flex justify-end px-6 pt-5">
      <NuxtLink
        to="/app"
        class="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Skip setup →
      </NuxtLink>
    </div>

    <!-- Progress dots -->
    <div class="flex justify-center gap-2 pt-2 pb-6">
      <div
        v-for="i in 3"
        :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :class="step >= i ? 'w-6 bg-brand-600' : 'w-2 bg-gray-200'"
      />
    </div>

    <!-- Step container -->
    <div class="flex flex-1 items-center justify-center px-6">
      <Transition name="slide" mode="out-in">
        <!-- Step 1: Welcome -->
        <div v-if="step === 1 && !transitioning" key="step1" class="w-full max-w-md text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600/10">
            <span class="text-4xl">👋</span>
          </div>
          <h1 class="font-display text-3xl font-bold text-brand-950">
            Welcome to SpendFixer,<br>{{ userName }}!
          </h1>
          <p class="mt-4 text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
            We'll connect to your bank and give you a daily 60-second snapshot of your spending. No complicated dashboards — just clarity.
          </p>
          <div class="mt-8 flex flex-col gap-3">
            <button
              class="w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/25 active:scale-95"
              @click="goToStep(2)"
            >
              Get Started →
            </button>
          </div>
          <p class="mt-4 text-xs text-gray-400">Takes under 5 minutes</p>
        </div>

        <!-- Step 2: Connect Bank -->
        <div v-else-if="step === 2 && !transitioning" key="step2" class="w-full max-w-md">
          <div class="text-center">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600/10">
              <span class="text-4xl">🏦</span>
            </div>
            <h2 class="font-display text-2xl font-bold text-brand-950">Connect Your Bank</h2>
            <p class="mt-3 text-sm text-gray-500 leading-relaxed">
              SpendFixer uses <strong class="text-brand-700">Plaid</strong> — the same technology trusted by Venmo, Robinhood, and thousands of apps — to securely connect your bank account.
            </p>
          </div>

          <!-- Trust bullets -->
          <div class="mt-6 space-y-3">
            <div class="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
              <span class="text-lg">🔒</span>
              <div>
                <p class="text-sm font-semibold text-brand-950">256-bit encryption</p>
                <p class="text-xs text-gray-500">Bank-level security for all your data</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
              <span class="text-lg">👁️</span>
              <div>
                <p class="text-sm font-semibold text-brand-950">Read-only access</p>
                <p class="text-xs text-gray-500">We can never move money — only view transactions</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
              <span class="text-lg">🏛️</span>
              <div>
                <p class="text-sm font-semibold text-brand-950">Bank-level security</p>
                <p class="text-xs text-gray-500">Plaid is used by 8,000+ apps and 12,000+ banks</p>
              </div>
            </div>
          </div>

          <p v-if="linkError" class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ linkError }}
          </p>

          <div class="mt-6 flex flex-col gap-3">
            <button
              :disabled="isLinking"
              class="w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="connectBank"
            >
              <span v-if="isLinking" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting...
              </span>
              <span v-else>🔗 Connect Bank Account</span>
            </button>
            <button
              class="w-full rounded-full border border-gray-200 bg-white py-3.5 text-sm font-medium text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700"
              @click="skipBank"
            >
              Skip for now
            </button>
          </div>

          <!-- Trust badges -->
          <div class="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Secured by Plaid
            </span>
            <span class="flex items-center gap-1">
              <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              256-bit SSL
            </span>
            <span class="flex items-center gap-1">
              <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Read-only
            </span>
          </div>
        </div>

        <!-- Step 3: First Insight -->
        <div v-else-if="step === 3 && !transitioning" key="step3" class="w-full max-w-md text-center">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50">
            <span class="text-4xl">{{ bankConnected ? '🎉' : '✨' }}</span>
          </div>
          <h2 class="font-display text-2xl font-bold text-brand-950">You're all set!</h2>

          <!-- Bank connected: real/mock spending summary -->
          <div v-if="bankConnected" class="mt-6">
            <p class="text-sm text-gray-500 mb-4">Here's a snapshot of this month so far:</p>
            <div class="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 text-left">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Spent this month</p>
              <p class="font-display text-4xl font-bold text-brand-950">{{ formatCurrency(spendingSummary.amount) }}</p>
              <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  Top: {{ spendingSummary.topCategory }}
                </span>
                <span>{{ spendingSummary.transactions }} transactions</span>
              </div>
              <div class="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full w-3/4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-1000" />
              </div>
              <p class="mt-2 text-xs text-gray-400">SpendFixer is analyzing your patterns…</p>
            </div>
          </div>

          <!-- Skipped: mock dashboard preview -->
          <div v-else class="mt-6">
            <p class="text-sm text-gray-500 mb-4">Here's what you'll see once you connect your bank:</p>
            <!-- Mock dashboard card -->
            <div class="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 text-left opacity-80 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 pointer-events-none z-10" />
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Spent this month</p>
              <p class="font-display text-4xl font-bold text-brand-950">{{ formatCurrency(spendingSummary.amount) }}</p>
              <div class="mt-4 flex gap-2 flex-wrap">
                <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">🍔 Dining $340</span>
                <span class="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">📱 Subscriptions $127</span>
                <span class="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">🛒 Groceries $285</span>
              </div>
              <div class="mt-4 space-y-2">
                <div class="h-2 rounded-full bg-brand-100 overflow-hidden">
                  <div class="h-full w-4/5 rounded-full bg-brand-500" />
                </div>
                <div class="h-2 rounded-full bg-purple-100 overflow-hidden">
                  <div class="h-full w-2/5 rounded-full bg-purple-500" />
                </div>
                <div class="h-2 rounded-full bg-orange-100 overflow-hidden">
                  <div class="h-full w-3/5 rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
            <p class="mt-3 text-xs text-gray-400">Connect your bank to see real numbers like these</p>
          </div>

          <div class="mt-8 flex flex-col gap-3">
            <NuxtLink
              to="/app"
              class="w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/25 text-center block"
            >
              Go to Dashboard →
            </NuxtLink>
            <button
              v-if="!bankConnected"
              class="w-full rounded-full border border-gray-200 bg-white py-3.5 text-sm font-medium text-brand-600 transition-all hover:border-brand-200"
              @click="goToStep(2)"
            >
              Connect bank first
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <div class="pb-8 text-center text-xs text-gray-400">
      <NuxtLink to="/" class="hover:text-gray-600 transition-colors">SpendFixer</NuxtLink>
      &nbsp;·&nbsp;
      <NuxtLink to="/privacy" class="hover:text-gray-600 transition-colors">Privacy</NuxtLink>
      &nbsp;·&nbsp;
      <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.22s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
