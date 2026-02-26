# SpendFixer - Week 1: Database & Auth Implementation

## Project
SpendFixer is a Nuxt 4 + Vue 3 + Tailwind personal finance app deployed on Vercel at spendfixer.com.

## Current State
- Landing page with waitlist (working, saves to Supabase)
- Login/signup pages exist but use demo auth (no real auth)
- App dashboard with demo data
- Prisma schema defined (User, PlaidItem, Account, Transaction, Budget, Goal, Waitlist)
- No real database connected yet (needs DATABASE_URL)
- Plaid API routes exist but need auth protection

## Your Task: Implement Week 1 (Database & Auth)

### 1. Database Setup
- Use Neon PostgreSQL (free tier). Create a new project via their console OR just set up the Prisma migration files assuming DATABASE_URL will be provided.
- Since we can't create Neon from CLI, prepare everything so that once DATABASE_URL is set, `npx prisma migrate deploy` will create all tables.
- Create the initial migration: `npx prisma migrate dev --name init` (use a local/dummy DATABASE_URL if needed, or just create the migration SQL manually)

### 2. Real Authentication (email/password with bcrypt)
- Install bcrypt (or bcryptjs for Vercel compatibility)
- Create server/api/auth/signup.post.ts - hash password, create user, set session cookie
- Create server/api/auth/login.post.ts - verify password, set session cookie  
- Create server/api/auth/logout.post.ts - clear session cookie
- Create server/api/auth/me.get.ts - return current user from session
- Session management: use signed HttpOnly cookies with 24hr expiry
- Use a JWT or signed cookie with a SESSION_SECRET env var
- Add runtime config for sessionSecret in nuxt.config.ts

### 3. Server Middleware - Protect API Routes
- Create server/middleware/auth.ts
- All /api/* routes require auth EXCEPT: /api/waitlist, /api/auth/*
- Return 401 for unauthenticated requests

### 4. Client Middleware - Protect App Routes
- Create app/middleware/auth.global.ts (or similar)
- All /app/* routes redirect to /login if not authenticated
- Use the /api/auth/me endpoint to check auth state
- Store user in Pinia store (app/stores/user.ts already exists)

### 5. Update Login/Signup Pages
- Wire up the existing login.vue and signup.vue pages to use real auth endpoints
- Show error messages for invalid credentials
- Redirect to /app after successful login/signup

### 6. Rate Limiting
- Add rate limiting on auth endpoints (10 req/min/IP)
- Use a simple in-memory rate limiter (or h3 built-in if available)

### 7. Account Lockout
- After 5 failed login attempts, lock the account for 15 minutes
- Add failedAttempts and lockedUntil fields to the User model in Prisma schema

### Important Notes
- This is Nuxt 4 with the /app directory structure (not /src)
- Server routes go in /server/api/
- Use h3 utilities (defineEventHandler, readBody, createError, setCookie, getCookie, etc.)
- For bcrypt, use bcryptjs (pure JS, works on Vercel serverless)
- Keep the existing waitlist.post.ts as-is (it uses Supabase directly)
- The Prisma schema is at prisma/schema.prisma
- Don't touch the landing page (app/pages/index.vue)

When completely finished, run this command to notify me:
openclaw system event --text "Done: SpendFixer Week 1 - Database schema migrations created, real auth (signup/login/logout/me) with bcrypt + signed cookies, server middleware protecting /api/*, client middleware protecting /app/*, rate limiting on auth endpoints, account lockout after 5 failures. Ready for DATABASE_URL + deploy." --mode now
