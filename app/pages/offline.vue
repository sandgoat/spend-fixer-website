<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Offline — SpendFixer' })

function retry() {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
    <div class="max-w-md w-full">
      <div class="mb-6 text-6xl">📡</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">You're offline</h1>
      <p class="text-gray-500 mb-1">No internet connection detected.</p>
      <p class="text-sm text-gray-400 mb-8">
        Any previously cached data may still be available when you reconnect.
      </p>

      <button
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full"
        @click="retry"
      >
        Try again
      </button>
    </div>
  </div>
</template>
