<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Goals' })
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-brand-950">Goals</h1>
        <p class="mt-1 text-sm text-gray-500">Track your savings targets</p>
      </div>
      <button class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
        New Goal
      </button>
    </div>

    <div class="mt-8 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
      <div class="text-center">
        <p class="text-4xl">🎯</p>
        <h3 class="mt-4 font-display text-lg font-bold text-brand-950">Create your first savings goal</h3>
        <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          Set a target, pick a date, and we'll track your progress automatically.
        </p>
      </div>
    </div>
  </div>
</template>
