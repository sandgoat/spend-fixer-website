export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body?.email?.trim()?.toLowerCase()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid email is required',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Waitlist] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const headers = getHeaders(event)
  const ip = headers['x-forwarded-for']?.split(',')[0]?.trim() || headers['x-real-ip'] || ''
  const userAgent = headers['user-agent'] || ''

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/spendfixer_waitlist`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        source: 'website',
        ip_address: ip,
        user_agent: userAgent,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      if (err.includes('duplicate') || err.includes('unique')) {
        return { success: true, message: "You're already on the list!" }
      }
      console.error('[Waitlist] Supabase error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to join waitlist' })
    }

    console.log(`[Waitlist] New signup: ${email}`)
    return { success: true, message: 'Added to waitlist' }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('[Waitlist] Error:', err.message)
    throw createError({ statusCode: 500, statusMessage: 'Failed to join waitlist' })
  }
})
