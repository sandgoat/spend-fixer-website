# SpendFixer — 3-Month Development Roadmap

**Created:** February 24, 2026
**Timeline:** February 25 – May 25, 2026
**Goal:** Launch SpendFixer to public with real bank sync, production security, organic growth engine, and first paying users.

---

## Current State (What's Built)

- [x] Nuxt 4 + Vue 3 + Tailwind CSS project scaffolded
- [x] Landing page with waitlist signup
- [x] Login / signup pages (demo auth — no real auth yet)
- [x] App dashboard with demo data
- [x] Transactions, budgets, goals, settings pages (shells)
- [x] Plaid API routes (link token, exchange token, sync, recurring, accounts, transactions, summary)
- [x] Prisma schema (User, PlaidItem, Account, Transaction, Budget, Goal, Waitlist)
- [x] Composables (usePlaid, useAccounts, useTransactions)
- [x] Deployed to Vercel at spendfixer.com
- [x] Domain configured (Hostinger → Vercel nameservers)
- [x] Security policy, access controls policy, data retention policy (documented)
- [x] Plaid production access application in progress

---

## Month 1: Foundation (Feb 25 – Mar 25)

### Week 1: Database & Auth (Feb 25 – Mar 3)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 1.1.1 | Set up PostgreSQL database (Neon or Supabase free tier) | Critical | 1 | None |
| 1.1.2 | Run `prisma migrate deploy` to create all tables | Critical | 0.5 | 1.1.1 |
| 1.1.3 | Add DATABASE_URL to Vercel environment variables | Critical | 0.5 | 1.1.1 |
| 1.1.4 | Implement real authentication (email/password) with bcrypt password hashing | Critical | 4 | 1.1.2 |
| 1.1.5 | Implement session management (signed HttpOnly cookies, 24hr expiry) | Critical | 3 | 1.1.4 |
| 1.1.6 | Add server middleware to protect /api/* routes (require auth) | Critical | 2 | 1.1.5 |
| 1.1.7 | Add client middleware to protect /app/* routes (redirect to login) | Critical | 1 | 1.1.5 |
| 1.1.8 | Implement logout (clear session, revoke cookies) | High | 1 | 1.1.5 |
| 1.1.9 | Add rate limiting on auth endpoints (10 req/min/IP) | High | 2 | 1.1.4 |
| 1.1.10 | Add account lockout after 5 failed login attempts | High | 1 | 1.1.4 |
| 1.1.11 | Test full auth flow end-to-end (signup → login → app → logout) | Critical | 2 | All above |
| 1.1.12 | Deploy and verify in production | Critical | 1 | 1.1.11 |

### Week 2: Plaid Production & Bank Sync (Mar 3 – Mar 10)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 1.2.1 | Complete Plaid production access questionnaire | Critical | 2 | Security policies |
| 1.2.2 | Add Plaid production credentials to Vercel env vars | Critical | 0.5 | 1.2.1 approved |
| 1.2.3 | Encrypt Plaid access tokens before database storage (AES-256) | Critical | 3 | 1.1.2 |
| 1.2.4 | Implement Plaid webhook endpoint for transaction updates | High | 3 | 1.2.2 |
| 1.2.5 | Add Plaid webhook signature verification | High | 1 | 1.2.4 |
| 1.2.6 | Handle Plaid error states (ITEM_LOGIN_REQUIRED, institution downtime) | High | 2 | 1.2.2 |
| 1.2.7 | Implement bank disconnect flow (call /item/remove, delete local data) | High | 2 | 1.2.2 |
| 1.2.8 | Test full Plaid flow with sandbox, then production | Critical | 3 | All above |
| 1.2.9 | Add re-authentication flow when Plaid token expires | High | 2 | 1.2.6 |
| 1.2.10 | Deploy and verify bank sync in production | Critical | 1 | 1.2.8 |

### Week 3: Security Hardening (Mar 10 – Mar 17)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 1.3.1 | Configure security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) | Critical | 2 | None |
| 1.3.2 | Implement CSRF protection on all POST/PUT/DELETE routes | High | 2 | None |
| 1.3.3 | Add input validation with Zod on all API endpoints | High | 4 | None |
| 1.3.4 | Audit all API routes — ensure no sensitive data in responses | High | 2 | None |
| 1.3.5 | Ensure no Plaid tokens, passwords, or secrets appear in logs | Critical | 1 | None |
| 1.3.6 | Add error handling middleware (generic errors to client, detailed to server logs) | High | 2 | None |
| 1.3.7 | Run `npm audit` and fix all critical/high vulnerabilities | High | 1 | None |
| 1.3.8 | Set up Dependabot or Renovate for automated dependency updates | Medium | 1 | None |
| 1.3.9 | Implement account deletion flow (delete user, revoke Plaid, purge data) | Critical | 3 | 1.2.7 |
| 1.3.10 | Test account deletion end-to-end (verify zero data remains) | Critical | 1 | 1.3.9 |
| 1.3.11 | Deploy security hardening to production | Critical | 1 | All above |

### Week 4: Legal & Compliance Pages (Mar 17 – Mar 25)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 1.4.1 | Write and publish Privacy Policy at /privacy | Critical | 3 | None |
| 1.4.2 | Reference Plaid and link to Plaid End User Privacy Policy | Critical | 0.5 | 1.4.1 |
| 1.4.3 | Write and publish Terms of Service at /terms | Critical | 3 | None |
| 1.4.4 | Add cookie consent banner (if using analytics cookies) | Medium | 2 | None |
| 1.4.5 | Add links to Privacy Policy and Terms in signup flow and footer | High | 1 | 1.4.1, 1.4.3 |
| 1.4.6 | Create /contact page with support email | Medium | 1 | None |
| 1.4.7 | Set up support email (support@spendfixer.com or similar) | Medium | 1 | None |
| 1.4.8 | Submit final Plaid production documentation if any gaps remain | High | 2 | 1.4.1 |
| 1.4.9 | Deploy all legal pages to production | Critical | 0.5 | All above |

---

## Month 2: Core Features & Polish (Mar 25 – Apr 25)

### Week 5: Onboarding & Daily Digest (Mar 25 – Apr 1)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 2.5.1 | Build onboarding flow (welcome → connect bank → first insight, < 5 min) | Critical | 6 | Month 1 complete |
| 2.5.2 | Auto-categorization improvements (map Plaid categories to user-friendly labels) | High | 3 | None |
| 2.5.3 | Build daily digest component (one-screen summary: spent today, budget status, alerts) | Critical | 4 | None |
| 2.5.4 | Implement spending alerts logic (detect unusual spending vs. historical avg) | High | 4 | Transaction data flowing |
| 2.5.5 | Add time-aware greeting (good morning/afternoon/evening) with personalized insight | Low | 1 | Already done, polish |
| 2.5.6 | Deploy and test onboarding with a real bank account | Critical | 2 | All above |

### Week 6: Budgets & Goals (Apr 1 – Apr 8)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 2.6.1 | Build budget creation flow (pick category, set monthly limit) | Critical | 4 | None |
| 2.6.2 | Budget tracking — calculate spent vs. limit from real transactions | Critical | 3 | Transaction data |
| 2.6.3 | Auto-budget suggestions (analyze 3 months of spending, suggest limits) | High | 4 | Transaction data |
| 2.6.4 | Budget overview dashboard (all budgets, progress bars, over/under) | High | 3 | 2.6.1, 2.6.2 |
| 2.6.5 | Build goal creation flow (name, target amount, deadline) | High | 3 | None |
| 2.6.6 | Goal progress tracking (manual updates for now) | High | 2 | 2.6.5 |
| 2.6.7 | Budget/goal API routes with Zod validation | High | 2 | 2.6.1, 2.6.5 |
| 2.6.8 | Deploy budgets and goals | High | 1 | All above |

### Week 7: Charts & Spending Insights (Apr 8 – Apr 15)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 2.7.1 | Install chart library (Chart.js or lightweight alternative) | Medium | 1 | None |
| 2.7.2 | Spending by category chart (pie/donut for current month) | High | 3 | Transaction data |
| 2.7.3 | Spending over time chart (line chart, daily/weekly/monthly) | High | 3 | Transaction data |
| 2.7.4 | Income vs. expenses chart (monthly comparison) | Medium | 3 | Transaction data |
| 2.7.5 | Net worth over time chart (if multiple account types) | Medium | 3 | Account balance data |
| 2.7.6 | Recurring transactions / subscriptions page (from Plaid recurring endpoint) | High | 4 | Plaid recurring data |
| 2.7.7 | Subscription total + "you spend $X/month on subscriptions" insight | Medium | 2 | 2.7.6 |
| 2.7.8 | Deploy charts and insights | High | 1 | All above |

### Week 8: PWA, Notifications & Performance (Apr 15 – Apr 22)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 2.8.1 | Configure PWA manifest (app name, icons, theme color, display: standalone) | High | 2 | None |
| 2.8.2 | Create app icons (192x192, 512x512) from SpendFixer logo | High | 1 | None |
| 2.8.3 | Add service worker for offline support (cache shell, show offline message) | Medium | 3 | None |
| 2.8.4 | Add "Install App" prompt for mobile users | Medium | 2 | 2.8.1 |
| 2.8.5 | Implement email notifications (daily digest email, spending alerts) | High | 4 | Email provider setup |
| 2.8.6 | Set up transactional email provider (Resend, Postmark, or SendGrid free tier) | High | 2 | None |
| 2.8.7 | Performance audit — Lighthouse score optimization (target 90+ on all metrics) | Medium | 3 | None |
| 2.8.8 | Image optimization (logo WebP, lazy loading) | Low | 1 | None |
| 2.8.9 | Deploy PWA + notifications | High | 1 | All above |

---

## Month 3: Growth, Marketing & Launch (Apr 25 – May 25)

### Week 9: SEO Foundation (Apr 25 – May 2)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 3.9.1 | Set up Google Search Console and verify spendfixer.com | Critical | 1 | None |
| 3.9.2 | Set up Google Analytics 4 (or PostHog) | High | 1 | None |
| 3.9.3 | Submit sitemap.xml to Google Search Console | High | 1 | 3.9.1 |
| 3.9.4 | Optimize meta tags on all pages (title, description, og:image, twitter:card) | High | 2 | None |
| 3.9.5 | Create og:image template (social sharing preview) | Medium | 1 | None |
| 3.9.6 | Add structured data / JSON-LD (Organization, WebApplication, FAQPage) | Medium | 2 | None |
| 3.9.7 | Create /blog section with Nuxt Content module | High | 3 | None |
| 3.9.8 | Internal linking strategy (blog → landing page → signup) | Medium | 1 | 3.9.7 |
| 3.9.9 | Set up canonical URLs and proper heading hierarchy on all pages | Medium | 1 | None |
| 3.9.10 | Deploy SEO foundations | High | 0.5 | All above |

### Week 10: Content Marketing (May 2 – May 9)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 3.10.1 | Write blog post: "Best Free Budgeting Apps in 2026 (Tested)" | Critical | 4 | 3.9.7 |
| 3.10.2 | Write blog post: "What Happened to Mint? Best Alternatives" | Critical | 4 | 3.9.7 |
| 3.10.3 | Write blog post: "YNAB vs SpendFixer: Which Is Right for You?" | High | 3 | 3.9.7 |
| 3.10.4 | Write blog post: "How to Budget in 60 Seconds a Day" | High | 3 | 3.9.7 |
| 3.10.5 | Write blog post: "Monarch Money Review 2026: Pros, Cons, and Alternatives" | Medium | 3 | 3.9.7 |
| 3.10.6 | Create comparison landing pages (/compare/ynab, /compare/monarch, /compare/rocket-money) | High | 4 | None |
| 3.10.7 | Keyword research — identify 20 target keywords with search volume and difficulty | High | 3 | None |
| 3.10.8 | Publish all content and submit URLs to Google Search Console | High | 1 | All above |

### Week 11: Launch & Distribution (May 9 – May 16)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 3.11.1 | Prepare ProductHunt launch (tagline, images, description, maker comment) | Critical | 4 | App feature-complete |
| 3.11.2 | Create demo video / GIF showing the 60-second daily check-in | High | 3 | App working |
| 3.11.3 | Write Hacker News "Show HN" post | High | 2 | None |
| 3.11.4 | Write Reddit posts for r/personalfinance, r/budgeting, r/ynab, r/mintuit | High | 2 | None |
| 3.11.5 | Write Twitter/X launch thread ("I was frustrated with budgeting apps, so I built one") | High | 2 | None |
| 3.11.6 | Email waitlist with launch announcement + early access link | Critical | 2 | Email provider set up |
| 3.11.7 | Launch on ProductHunt | Critical | 1 | 3.11.1 |
| 3.11.8 | Post to HN, Reddit, Twitter/X on launch day | Critical | 1 | 3.11.3-5 |
| 3.11.9 | Monitor and respond to all launch day comments/feedback | Critical | 4 | 3.11.7-8 |
| 3.11.10 | Set up feedback collection (in-app or Canny/Nolt) | Medium | 2 | None |

### Week 12: Payment, Analytics & Iteration (May 16 – May 25)

| ID | Task | Priority | Est. Hours | Dependencies |
|----|------|----------|-----------|--------------|
| 3.12.1 | Integrate Stripe for subscription payments (Plus $4.99/mo, Pro $9.99/mo) | Critical | 6 | None |
| 3.12.2 | Build upgrade flow in-app (settings → choose plan → Stripe checkout) | Critical | 4 | 3.12.1 |
| 3.12.3 | Handle Stripe webhooks (subscription created, canceled, payment failed) | Critical | 3 | 3.12.1 |
| 3.12.4 | Gate premium features behind plan check (unlimited budgets, CSV export, etc.) | High | 3 | 3.12.1 |
| 3.12.5 | Set up PostHog analytics (signup funnel, bank connect rate, daily active, retention) | High | 3 | None |
| 3.12.6 | Create analytics dashboard tracking key metrics (signup→connect→active→paid) | High | 2 | 3.12.5 |
| 3.12.7 | Implement CSV export for Plus/Pro users | Medium | 2 | 3.12.4 |
| 3.12.8 | Bug fixes and UX improvements from launch feedback | Critical | 8 | 3.11.9 |
| 3.12.9 | Final production deploy with payments live | Critical | 1 | All above |

---

## Ongoing / Recurring Tasks (All 3 Months)

### Security (Weekly)

| ID | Task | Frequency |
|----|------|-----------|
| O.1 | Run `npm audit` and patch critical vulnerabilities | Weekly |
| O.2 | Review Vercel deployment logs for anomalies | Weekly |
| O.3 | Verify database backups are running | Weekly |
| O.4 | Monitor auth endpoint for brute force attempts | Daily (automated) |

### Security (Monthly)

| ID | Task | Frequency |
|----|------|-----------|
| O.5 | Full dependency update and audit | Monthly |
| O.6 | Review and rotate API keys/secrets if needed | Monthly |
| O.7 | Test backup restoration | Monthly |
| O.8 | Review access control list (who has access to what) | Monthly |

### Security (Quarterly)

| ID | Task | Frequency |
|----|------|-----------|
| O.9 | Full risk assessment review | End of Month 3 |
| O.10 | Review and update security policies | End of Month 3 |
| O.11 | Penetration test (self or external) | End of Month 3 |

### SEO (Ongoing)

| ID | Task | Frequency |
|----|------|-----------|
| O.12 | Publish 1-2 blog posts per week (after Week 10) | Weekly |
| O.13 | Monitor Google Search Console for indexing issues | Weekly |
| O.14 | Track keyword rankings for target keywords | Biweekly |
| O.15 | Build backlinks (guest posts, directories, HARO responses) | Weekly |
| O.16 | Update comparison pages when competitors change pricing/features | Monthly |

### Marketing (Ongoing)

| ID | Task | Frequency |
|----|------|-----------|
| O.17 | Engage in Reddit personal finance communities (genuine help, not spam) | 3x/week |
| O.18 | Post on Twitter/X about personal finance tips + SpendFixer updates | 3x/week |
| O.19 | Respond to all user feedback and support requests | Daily |
| O.20 | A/B test landing page headline and CTA | Biweekly |
| O.21 | Email waitlist with updates and early access invites | Biweekly |

---

## Success Metrics (End of Month 3)

| Metric | Target |
|--------|--------|
| Waitlist signups | 1,000+ |
| Registered users | 500+ |
| Bank accounts connected | 300+ (60% activation) |
| Daily active users | 150+ (30% DAU/MAU) |
| Paid subscribers (Plus/Pro) | 25-40 (5-8% conversion) |
| Monthly recurring revenue | $125-200 |
| Blog posts published | 10+ |
| Lighthouse performance score | 90+ |
| Security vulnerabilities (critical/high) | 0 |
| Uptime | 99.9%+ |
| ProductHunt upvotes | 100+ |
| Google-indexed pages | 20+ |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Plaid production access delayed | Medium | High | Submit all documentation ASAP. Build with sandbox in parallel. Have manual transaction entry as fallback. |
| Low initial signup volume | Medium | Medium | Pre-build content/SEO so organic traffic is growing before launch. Multiple distribution channels. |
| Bank sync reliability issues | Medium | High | Implement robust error handling. Show clear messages. Allow manual transaction entry. |
| Competitor launches free tier | Low | High | Focus on simplicity moat (60-second daily check-in). Speed of iteration. |
| Database costs exceed free tier | Low | Medium | Monitor usage. Neon/Supabase free tiers are generous. Optimize queries early. |

---

## Task Summary

| Phase | Tasks | Est. Hours |
|-------|-------|-----------|
| Month 1: Foundation | 43 tasks | ~75 hours |
| Month 2: Features | 33 tasks | ~80 hours |
| Month 3: Growth | 38 tasks | ~85 hours |
| Ongoing/Recurring | 21 recurring tasks | ~10 hours/week |
| **Total** | **135 tasks + recurring** | **~280 hours** |
