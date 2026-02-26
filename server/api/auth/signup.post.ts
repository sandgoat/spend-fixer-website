export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!checkRateLimit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const body = await readBody(event)
  const { name, email, password } = body || {}

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name || null,
      password: hashed,
    },
  })

  const token = signToken({ userId: user.id })
  setAuthCookie(event, token)

  return { id: user.id, email: user.email, name: user.name, plan: user.plan }
})
