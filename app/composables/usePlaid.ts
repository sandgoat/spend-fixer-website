export function usePlaid() {
  const isLinkReady = ref(false)
  const isLinking = ref(false)
  const linkError = ref<string | null>(null)

  const openPlaidLink = async (userId: string, onSuccess: () => void) => {
    isLinking.value = true
    linkError.value = null

    try {
      const { linkToken } = await $fetch('/api/plaid/link-token', {
        method: 'POST',
        body: { userId },
      })

      await loadPlaidScript()

      const handler = (window as any).Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken: string) => {
          try {
            await $fetch('/api/plaid/exchange-token', {
              method: 'POST',
              body: { publicToken, userId },
            })

            await $fetch('/api/plaid/sync', {
              method: 'POST',
              body: { userId },
            })

            onSuccess()
          } catch (err: any) {
            linkError.value = err.message || 'Failed to connect account'
          } finally {
            isLinking.value = false
          }
        },
        onExit: () => {
          isLinking.value = false
        },
        onEvent: (eventName: string) => {
          console.log('[Plaid Event]', eventName)
        },
      })

      handler.open()
    } catch (err: any) {
      linkError.value = err.message || 'Failed to initialize Plaid Link'
      isLinking.value = false
    }
  }

  return {
    isLinkReady: readonly(isLinkReady),
    isLinking: readonly(isLinking),
    linkError: readonly(linkError),
    openPlaidLink,
  }
}

function loadPlaidScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Plaid) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Plaid Link'))
    document.head.appendChild(script)
  })
}
