<script setup lang="ts">
const route = useRoute()
const userStore = useUserStore()

const navigation = [
  { name: 'Dashboard', href: '/app' },
  { name: 'Transactions', href: '/app/transactions' },
  { name: 'Budgets', href: '/app/budgets' },
  { name: 'Goals', href: '/app/goals' },
  { name: 'Subscriptions', href: '/app/subscriptions' },
  { name: 'Settings', href: '/app/settings' },
]

const isMobileMenuOpen = ref(false)

const isActive = (href: string) => route.path === href
</script>

<template>
  <div class="min-h-screen bg-cream">
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-gray-200 bg-white lg:block">
      <div class="flex h-20 items-center px-6">
        <NuxtLink to="/">
          <NuxtImg src="/logo.png" alt="SpendFixer" class="h-8" format="webp" width="128" height="32" loading="lazy" />
        </NuxtLink>
      </div>

      <nav class="mt-2 space-y-0.5 px-3">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
          :class="isActive(item.href)
            ? 'bg-brand-50 text-brand-700'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="rounded-xl bg-brand-50 p-4">
          <p class="font-display text-sm font-bold text-brand-800">Free Plan</p>
          <p class="mt-1 text-xs text-brand-600">Unlock AI fixes for $7.99/mo</p>
          <NuxtLink
            to="/app/settings"
            class="mt-3 block rounded-full bg-brand-600 px-4 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Upgrade to Plus →
          </NuxtLink>
        </div>
      </div>
    </aside>

    <div class="lg:pl-60">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md lg:h-20 lg:px-8">
        <button
          class="lg:hidden"
          aria-label="Toggle menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex-1" />
        <button
          class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          @click="userStore.logout()"
        >
          Log out
        </button>
        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100">
          <span class="text-sm font-semibold text-brand-700">{{ userStore.user?.email?.[0]?.toUpperCase() || 'U' }}</span>
        </div>
      </header>

      <main class="p-5 lg:p-8">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 lg:hidden">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="isMobileMenuOpen = false" />
          <aside class="absolute inset-y-0 left-0 w-60 bg-white shadow-2xl">
            <div class="flex h-20 items-center px-6">
              <NuxtImg src="/logo.png" alt="SpendFixer" class="h-8" format="webp" width="128" height="32" loading="lazy" />
            </div>
            <nav class="mt-2 space-y-0.5 px-3">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                :class="isActive(item.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                @click="isMobileMenuOpen = false"
              >
                {{ item.name }}
              </NuxtLink>
            </nav>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
