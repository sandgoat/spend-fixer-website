import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { prisma } from './prisma'

const COOKIE_NAME = 'sf_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

function getSecret() {
  return useRuntimeConfig().sessionSecret as string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '24h' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { userId: string }
  } catch {
    return null
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export async function getUserFromEvent(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, plan: true, createdAt: true },
  })

  return user
}
