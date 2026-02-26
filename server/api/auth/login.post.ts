const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!checkRateLimit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
    throw createError({ statusCode: 423, statusMessage: `Account locked. Try again in ${mins} minute(s).` })
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    const attempts = user.failedAttempts + 1
    const update: any = { failedAttempts: attempts }
    if (attempts >= MAX_ATTEMPTS) {
      update.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
    }
    await prisma.user.update({ where: { id: user.id }, data: update })
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Reset failed attempts on success
  if (user.failedAttempts > 0) {
    await prisma.user.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null } })
  }

  const token = signToken({ userId: user.id })
  setAuthCookie(event, token)

  return { id: user.id, email: user.email, name: user.name, plan: user.plan }
})
