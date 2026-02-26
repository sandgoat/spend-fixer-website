export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: string; name: string | null; email: string; plan: string } | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function setUser(u: { id: string; name: string | null; email: string; plan: string }) {
    user.value = u
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{ id: string; name: string | null; email: string; plan: string }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = res
  }

  async function signup(name: string, email: string, password: string) {
    const res = await $fetch<{ id: string; name: string | null; email: string; plan: string }>('/api/auth/signup', {
      method: 'POST',
      body: { name, email, password },
    })
    user.value = res
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/')
  }

  async function fetchUser() {
    try {
      const res = await $fetch<{ id: string; name: string | null; email: string; plan: string }>('/api/auth/me')
      user.value = res
    } catch {
      user.value = null
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    setUser,
    login,
    signup,
    logout,
    fetchUser,
  }
})
