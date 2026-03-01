<script setup lang="ts">
definePageMeta({ layout: 'app' })
useSeoMeta({ title: 'Insights — SpendFixer', robots: 'noindex, nofollow' })

const selectedCategory = ref<string | null>(null)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="font-display text-2xl font-bold text-brand-950">Spending Insights</h1>
      <p class="mt-1 text-sm text-gray-500">Charts and trends for your finances</p>
    </div>

    <!-- Top row: donut + line (ClientOnly: Chart.js is client-only) -->
    <div class="grid gap-6 lg:grid-cols-2">
      <ClientOnly>
        <ChartsSpendingByCategory
          @filter-category="(cat) => selectedCategory = cat"
        />
        <template #fallback><div class="h-64 animate-pulse rounded-xl bg-gray-100" /></template>
      </ClientOnly>
      <ClientOnly>
        <ChartsSpendingOverTime />
        <template #fallback><div class="h-64 animate-pulse rounded-xl bg-gray-100" /></template>
      </ClientOnly>
    </div>

    <!-- Filter badge -->
    <div v-if="selectedCategory" class="mt-4 flex items-center gap-2">
      <span class="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
        Filtering: {{ selectedCategory }}
      </span>
      <button
        class="text-xs text-gray-400 hover:text-gray-600"
        @click="selectedCategory = null"
      >
        Clear ✕
      </button>
    </div>

    <!-- Bottom row: bar + area (ClientOnly: Chart.js is client-only) -->
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <ClientOnly>
        <ChartsIncomeVsExpenses />
        <template #fallback><div class="h-64 animate-pulse rounded-xl bg-gray-100" /></template>
      </ClientOnly>
      <ClientOnly>
        <ChartsNetWorthOverTime />
        <template #fallback><div class="h-64 animate-pulse rounded-xl bg-gray-100" /></template>
      </ClientOnly>
    </div>

    <!-- Insight callouts -->
    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">Savings Rate</p>
        <p class="mt-1 font-display text-2xl font-bold text-brand-900">28%</p>
        <p class="mt-0.5 text-xs text-gray-500">↑ 4pts vs. last month</p>
      </div>
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">Top Spend Category</p>
        <p class="mt-1 font-display text-2xl font-bold text-amber-900">Bills</p>
        <p class="mt-0.5 text-xs text-gray-500">$580 this month</p>
      </div>
      <div class="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-teal-600">Net Worth Growth</p>
        <p class="mt-1 font-display text-2xl font-bold text-teal-900">+$6,000</p>
        <p class="mt-0.5 text-xs text-gray-500">$12k → $18k over 6 months</p>
      </div>
    </div>
  </div>
</template>
