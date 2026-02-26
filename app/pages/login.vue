<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Log In' })

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const userStore = useUserStore()

const handleLogin = async () => {
  if (!email.value || !password.value) return
  isLoading.value = true
  await userStore.login(email.value, password.value)
  await navigateTo('/app')
  isLoading.value = false
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="hidden w-1/2 bg-brand-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <img src="/logo.png" alt="SpendFixer" class="h-5 w-auto max-w-[200px] brightness-0 invert opacity-90">
      <div>
        <p class="font-display text-3xl font-bold text-white">Stop tracking. Start fixing.</p>
        <p class="mt-4 max-w-md text-brand-300">The finance app that tells you what to do — not just what you spent.</p>
      </div>
      <p class="text-sm text-brand-600">&copy; {{ new Date().getFullYear() }} SpendFixer</p>
    </div>

    <div class="flex flex-1 items-center justify-center bg-cream px-6">
      <div class="w-full max-w-sm">
        <NuxtLink to="/" class="lg:hidden">
          <img src="/logo.png" alt="SpendFixer" class="h-10">
        </NuxtLink>
        <h1 class="mt-8 font-display text-2xl font-bold text-brand-950 lg:mt-0">Welcome back</h1>
        <p class="mt-2 text-sm text-gray-500">Log in to your account</p>

        <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@email.com"
              class="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 disabled:opacity-50"
          >
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/signup" class="font-semibold text-brand-600 hover:text-brand-700">Sign up free</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
