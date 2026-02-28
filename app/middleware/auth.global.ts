export default defineNuxtRouteMiddleware(async (to) => {
  const protectedPaths = to.path.startsWith('/app') || to.path === '/onboarding'
  if (!protectedPaths) return

  const userStore = useUserStore()

  // If we haven't checked auth yet, try fetching current user
  if (!userStore.isAuthenticated) {
    try {
      const user = await $fetch('/api/auth/me')
      userStore.setUser(user as any)
    } catch {
      return navigateTo('/login')
    }
  }
})
