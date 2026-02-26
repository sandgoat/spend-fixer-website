<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Settings' })
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-brand-950">Settings</h1>
    <p class="mt-1 text-sm text-gray-500">Manage your account and preferences</p>

    <div class="mt-8 space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="font-display text-lg font-bold text-brand-950">Profile</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your name"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="font-display text-lg font-bold text-brand-950">Connected Accounts</h2>
        <p class="mt-1 text-sm text-gray-500">No bank accounts connected yet.</p>
        <button class="mt-4 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
          Connect Bank Account
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="font-display text-lg font-bold text-brand-950">Plan</h2>
        <div class="mt-2 flex items-center gap-3">
          <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">Free Plan</span>
          <NuxtLink to="/pricing" class="text-sm font-medium text-brand-600 hover:text-brand-700">
            Upgrade to Plus →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
