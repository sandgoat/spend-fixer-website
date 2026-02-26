<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Sign Up' })

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const userStore = useUserStore()

const handleSignup = async () => {
  if (!name.value || !email.value || !password.value) return
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
        <p class="font-display text-3xl font-bold text-white">Your money deserves more than a pie chart.</p>
        <p class="mt-4 max-w-md text-brand-300">AI that finds what's costing you — and fixes it in one tap. Free to start.</p>
      </div>
      <p class="text-sm text-brand-600">&copy; {{ new Date().getFullYear() }} SpendFixer</p>
    </div>

    <div class="flex flex-1 items-center justify-center bg-cream px-6">
      <div class="w-full max-w-sm">
        <NuxtLink to="/" class="lg:hidden">
          <img src="/logo.png" alt="SpendFixer" class="h-10">
        </NuxtLink>
        <h1 class="mt-8 font-display text-2xl font-bold text-brand-950 lg:mt-0">Create your account</h1>
        <p class="mt-2 text-sm text-gray-500">Start fixing your spending in 60 seconds</p>

        <form class="mt-8 space-y-4" @submit.prevent="handleSignup">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Your name"
              class="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
          </div>
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
            {{ isLoading ? 'Creating account...' : 'Create Account — It\'s Free' }}
          </button>
        </form>

        <p class="mt-4 text-center text-xs text-gray-400">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>

        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="font-semibold text-brand-600 hover:text-brand-700">Log in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
