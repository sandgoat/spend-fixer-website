<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Budgets' })
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-brand-950">Budgets</h1>
        <p class="mt-1 text-sm text-gray-500">Track spending by category</p>
      </div>
      <button class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
        New Budget
      </button>
    </div>

    <div class="mt-8 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
      <div class="text-center">
        <p class="text-4xl">🎯</p>
        <h3 class="mt-4 font-display text-lg font-bold text-brand-950">Set up your first budget</h3>
        <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          We'll suggest budgets based on your spending patterns once your bank is connected.
        </p>
      </div>
    </div>
  </div>
</template>
