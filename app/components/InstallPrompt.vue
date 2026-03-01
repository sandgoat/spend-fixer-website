<script setup lang="ts">
const DISMISS_KEY = 'sf_install_dismissed_until'
const DISMISS_DAYS = 7

const show = ref(false)
let deferredPrompt: any = null

function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent)
}

function isDismissed() {
  try {
    const until = localStorage.getItem(DISMISS_KEY)
    if (!until) return false
    return Date.now() < Number(until)
  } catch {
    return false
  }
}

function dismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000))
  } catch {}
  show.value = false
}

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    show.value = false
  }
  deferredPrompt = null
}

onMounted(() => {
  if (!isMobile() || isDismissed()) return

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e
    show.value = true
  })
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-0 inset-x-0 z-50 p-4 sm:hidden"
      role="banner"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
        <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
          💚
        </div>
        <p class="flex-1 text-sm text-gray-700 leading-snug">
          Add <strong>SpendFixer</strong> to your home screen for quick access.
        </p>
        <div class="flex flex-col gap-1.5 flex-shrink-0">
          <button
            class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            @click="install"
          >
            Install
          </button>
          <button
            class="text-gray-400 hover:text-gray-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
            @click="dismiss"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
