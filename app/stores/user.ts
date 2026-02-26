export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: string; name: string; email: string } | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, _password: string) => {
    // TODO: Real auth implementation
    user.value = { id: '1', name: 'User', email }
  }

  const logout = () => {
    user.value = null
    navigateTo('/')
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  }
})
