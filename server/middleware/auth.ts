export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Skip auth for non-API routes, auth endpoints, and waitlist
  if (!path.startsWith('/api/')) return
  if (path.startsWith('/api/auth/')) return
  if (path.startsWith('/api/waitlist')) return
  if (path === '/api/health') return

  // Skip auth enforcement if database isn't configured yet
  if (!process.env.DATABASE_URL) {
    throw createError({ statusCode: 503, statusMessage: 'Database not configured' })
  }

  const { getUserFromEvent } = await import('../utils/auth')
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.user = user
})
