<script setup lang="ts">
definePageMeta({ layout: 'app' })
useSeoMeta({ title: 'Settings — SpendFixer', robots: 'noindex, nofollow' })
useHead({ link: [{ rel: 'canonical', href: 'https://spendfixer.com/app/settings' }] })

const router = useRouter()

// Delete account state
const showDeleteModal = ref(false)
const deleteConfirmInput = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

const canConfirmDelete = computed(() => deleteConfirmInput.value === 'DELETE')

function openDeleteModal() {
  deleteConfirmInput.value = ''
  deleteError.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  if (isDeleting.value) return
  showDeleteModal.value = false
}

async function handleDeleteAccount() {
  if (!canConfirmDelete.value || isDeleting.value) return

  isDeleting.value = true
  deleteError.value = ''

  try {
    await $fetch('/api/account/delete', { method: 'POST' })
    // Redirect to home with deletion notice in query param
    router.push('/?deleted=1')
  } catch (err: any) {
    deleteError.value = err?.data?.statusMessage || 'Failed to delete account. Please try again.'
    isDeleting.value = false
  }
}
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

      <!-- Danger Zone -->
      <div class="rounded-xl border border-red-200 bg-white p-6">
        <h2 class="font-display text-lg font-bold text-red-700">Danger Zone</h2>
        <p class="mt-1 text-sm text-gray-500">
          Irreversible actions. Proceed with caution.
        </p>
        <div class="mt-4 flex items-start justify-between gap-4 rounded-lg border border-red-100 bg-red-50 p-4">
          <div>
            <p class="text-sm font-semibold text-red-800">Delete Account</p>
            <p class="mt-0.5 text-sm text-red-600">
              Permanently deletes your account, all transactions, budgets, goals, and bank connections.
            </p>
          </div>
          <button
            class="shrink-0 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-700 hover:text-white"
            @click="openDeleteModal"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeDeleteModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-display text-lg font-bold text-gray-900">Delete your account?</h3>
              <p class="mt-1 text-sm text-gray-600">
                This will permanently delete your account, all transactions, budgets, and bank connections.
                <strong>This cannot be undone.</strong>
              </p>
            </div>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-medium text-gray-700">
              Type <span class="font-mono font-bold text-red-700">DELETE</span> to confirm
            </label>
            <input
              v-model="deleteConfirmInput"
              type="text"
              placeholder="DELETE"
              :disabled="isDeleting"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
            >
          </div>

          <p v-if="deleteError" class="mt-3 text-sm text-red-600">
            {{ deleteError }}
          </p>

          <div class="mt-5 flex gap-3">
            <button
              :disabled="isDeleting"
              class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              @click="closeDeleteModal"
            >
              Cancel
            </button>
            <button
              :disabled="!canConfirmDelete || isDeleting"
              class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              @click="handleDeleteAccount"
            >
              <span v-if="isDeleting">Deleting...</span>
              <span v-else>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
