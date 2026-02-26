export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Skip auth for non-API routes, auth endpoints, and waitlist
  if (!path.startsWith('/api/')) return
  if (path.startsWith('/api/auth/')) return
  if (path.startsWith('/api/waitlist')) return

  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Attach user to event context for downstream handlers
  event.context.user = user
})
