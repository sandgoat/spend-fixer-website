<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'SpendFixer — Fix Your Spending in 60 Seconds a Day',
  description: 'SpendFixer connects to your bank and gives you one daily snapshot of where your money is going. No complicated dashboards. Just clarity.',
  ogTitle: 'SpendFixer — Fix Your Spending in 60 Seconds a Day',
  ogDescription: 'SpendFixer connects to your bank and gives you one daily snapshot of where your money is going. No complicated dashboards. Just clarity.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: siteUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'SpendFixer — Fix Your Spending in 60 Seconds a Day',
  twitterDescription: 'SpendFixer connects to your bank and gives you one daily snapshot of where your money is going. No complicated dashboards. Just clarity.',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'SpendFixer',
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/logo.png`,
            },
          },
          {
            '@type': 'WebApplication',
            '@id': `${siteUrl}/#webapp`,
            name: 'SpendFixer',
            url: siteUrl,
            description: 'SpendFixer connects to your bank and gives you one daily snapshot of where your money is going. No complicated dashboards. Just clarity.',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web, iOS, Android',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free',
                price: '0',
                priceCurrency: 'USD',
              },
              {
                '@type': 'Offer',
                name: 'Plus',
                price: '7.99',
                priceCurrency: 'USD',
              },
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '14.99',
                priceCurrency: 'USD',
              },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is SpendFixer?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SpendFixer is a personal finance app that connects to your bank and analyzes your spending. Instead of just showing you charts, it tells you exactly what to fix — unused subscriptions, bad rates, idle cash — and lets you act on it in one tap.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does bank sync work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SpendFixer uses Plaid, the industry-standard bank connection service trusted by thousands of apps. You connect once and stay connected. No re-authenticating every few days.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is my financial data secure?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. SpendFixer never stores your bank credentials. All connections are handled by Plaid, which uses bank-level 256-bit encryption. We only receive read-only transaction data.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does SpendFixer cost?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SpendFixer has a free plan that includes 2 bank connections, auto-categorization, and weekly spending digests — no credit card required. Plus is $7.99/month (or $59/year) for AI insights and daily action items. Pro is $14.99/month (or $119/year) for one-tap fix actions, spending forecasts, and financial coaching.',
                },
              },
            ],
          },
        ],
      }),
    },
  ],
})

const email = ref('')
const isSubmitted = ref(false)
const isLoading = ref(false)

const handleWaitlist = async () => {
  if (!email.value) return
  isLoading.value = true
  try {
    await $fetch('/api/waitlist', {
      method: 'POST',
      body: { email: email.value },
    })
    isSubmitted.value = true
  } catch {
    isSubmitted.value = true
  } finally {
    isLoading.value = false
  }
}

const stats = [
  { value: '20M+', label: 'people lost their budgeting app when Mint shut down' },
  { value: '$99–180', label: 'what competitors charge per year for basic tracking' },
  { value: '60s', label: 'your daily time commitment with SpendFixer' },
]

const problems = [
  { who: 'YNAB', pain: 'Takes 45 minutes to set up. Requires you to learn zero-based budgeting. Costs $109/year. Still just shows you data.' },
  { who: 'Monarch', pain: 'Bank sync disconnects constantly. Cluttered UI. $99/year to stare at pie charts you won\'t act on.' },
  { who: 'Rocket Money', pain: 'Aggressive upsells. Bill negotiation that doesn\'t always work. Up to $144/year.' },
  { who: 'Mint', pain: 'Gone. Dead. Replaced with Credit Karma — which is ads disguised as budgeting.' },
]

const howItWorks = [
  { step: '01', title: 'Connect your bank', desc: 'One tap. Plaid handles the rest. No re-authentication every 3 days.' },
  { step: '02', title: 'We find what to fix', desc: 'AI analyzes your spending patterns, detects subscriptions, and spots where you\'re overpaying — automatically.' },
  { step: '03', title: 'Fix it in one tap', desc: 'Cancel unused subscriptions. Switch to better rates. Move idle cash. SpendFixer tells you what to do and lets you do it.' },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Real budgeting. Not a stripped-down demo.',
    features: [
      '2 bank connections',
      'Auto-categorization',
      'Weekly spending digest',
      '3 budgets',
      'Spending charts',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Plus',
    price: '$7.99',
    period: '/mo',
    description: 'AI that tells you what to fix — and lets you do it.',
    features: [
      'Everything in Free',
      'Unlimited bank connections',
      'Real-time sync (on-demand refresh)',
      'AI spending insights',
      'Daily digest with action items',
      'Subscription detection',
      'Couples / household mode',
      'CSV export',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    annual: '$59/yr — save 38%',
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/mo',
    description: 'Your personal CFO. Powered by AI.',
    features: [
      'Everything in Plus',
      '"Fix it" one-tap actions',
      'AI financial coaching',
      'Spending forecasts',
      'Variable income tools',
      'Tax prep categories',
      'Custom reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
    annual: '$119/yr — save 34%',
  },
]
</script>

<template>
  <div class="bg-cream">
    <nav class="fixed top-0 z-50 w-full bg-cream/90 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <NuxtLink to="/" class="shrink-0">
          <img src="/logo.png" alt="SpendFixer" class="h-8 sm:h-10">
        </NuxtLink>
        <div class="hidden items-center gap-10 md:flex">
          <a href="#problem" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-700">The Problem</a>
          <a href="#how" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-700">How It Works</a>
          <a href="#pricing" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-700">Pricing</a>
          <NuxtLink to="/blog" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-700">Blog</NuxtLink>
        </div>
        <div class="flex items-center gap-3 sm:gap-4">
          <NuxtLink to="/login" class="hidden text-sm font-medium text-gray-600 transition-colors hover:text-brand-700 sm:block">
            Log in
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
          >
            <span class="sm:hidden">Get Started</span>
            <span class="hidden sm:inline">Get Started Free</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <section class="relative pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="lg:col-span-7">
            <p class="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700">
              Early Access
            </p>
            <h1 class="mt-6 font-display text-5xl font-bold text-brand-950 sm:text-6xl lg:text-7xl">
              Stop tracking.<br>Start fixing.
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              Every budgeting app shows you what you spent. SpendFixer tells you what to <strong class="text-brand-700">do about it</strong> — cancel unused subscriptions, switch to better rates, move idle cash. One tap. 60 seconds a day.
            </p>

            <div v-if="!isSubmitted" class="mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                v-model="email"
                type="email"
                placeholder="you@email.com"
                class="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                @keydown.enter="handleWaitlist"
              >
              <button
                :disabled="isLoading"
                class="rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 disabled:opacity-50"
                @click="handleWaitlist"
              >
                {{ isLoading ? 'Joining...' : 'Join the waitlist' }}
              </button>
            </div>
            <div v-else class="mt-10 max-w-md rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <p class="font-medium text-brand-800">You're in. We'll let you know when it's your turn.</p>
            </div>

            <p class="mt-4 text-sm text-gray-400">Free to start. No credit card required.</p>
          </div>

          <div class="lg:col-span-5">
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-brand-100/50" />
              <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div class="border-b border-gray-100 px-5 py-3">
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span class="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span class="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <div class="p-5">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Today's Fixes</p>
                  <div class="mt-4 flex items-end justify-between">
                    <div>
                      <p class="text-sm text-gray-500">You spent</p>
                      <p class="font-display text-4xl font-bold text-brand-950">$34.50</p>
                    </div>
                    <span class="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">↓ 22% vs avg</span>
                  </div>
                  <div class="mt-5">
                    <div class="flex justify-between text-xs text-gray-500">
                      <span>Monthly: $2,847 / $4,000</span>
                      <span class="font-semibold text-brand-600">71%</span>
                    </div>
                    <div class="mt-1.5 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div class="h-full rounded-full bg-brand-500" :style="{ width: '71%' }" />
                    </div>
                  </div>
                  <div class="mt-5 space-y-2.5">
                    <div class="flex items-center justify-between rounded-xl bg-red-50 p-3">
                      <p class="text-sm text-red-800">
                        <strong>Fix:</strong> Cancel unused Hulu ($15.99/mo) — last watched 47 days ago
                      </p>
                      <button class="shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Cancel</button>
                    </div>
                    <div class="flex items-center justify-between rounded-xl bg-amber-50 p-3">
                      <p class="text-sm text-amber-800">
                        <strong>Move:</strong> $3,200 idle in checking → earn $140/yr in high-yield savings
                      </p>
                      <button class="shrink-0 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">Move</button>
                    </div>
                  </div>
                  <div class="mt-4 space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-xs">🥑</div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">Whole Foods</p>
                          <p class="text-xs text-gray-400">Groceries</p>
                        </div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">-$67.32</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs">⛽</div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">Shell</p>
                          <p class="text-xs text-gray-400">Transportation</p>
                        </div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">-$42.15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-24 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <div
            v-for="stat in stats"
            :key="stat.value"
            class="bg-white px-8 py-8"
          >
            <p class="font-display text-3xl font-bold text-brand-600">{{ stat.value }}</p>
            <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="problem" class="py-24 lg:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-600">The problem</p>
          <h2 class="mt-4 font-display text-4xl font-bold text-brand-950 sm:text-5xl">
            Every budgeting app shows you data.<br>None tell you what to do.
          </h2>
          <p class="mt-5 text-lg leading-relaxed text-gray-600">
            You don't need another pie chart. You need someone to say "cancel this, switch that, move this money." That's SpendFixer.
          </p>
        </div>

        <div class="mt-16 grid gap-4 sm:grid-cols-2">
          <div
            v-for="(item, i) in problems"
            :key="item.who"
            class="rounded-2xl p-7"
            :class="i === 3 ? 'border-2 border-dashed border-gray-300 bg-white' : 'border border-gray-200 bg-white'"
          >
            <p class="font-display text-lg font-bold text-brand-950">{{ item.who }}</p>
            <p class="mt-3 text-sm leading-relaxed text-gray-600">{{ item.pain }}</p>
          </div>
        </div>

        <div class="mt-8 rounded-2xl bg-brand-600 p-8 sm:p-10">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-display text-2xl font-bold text-white sm:text-3xl">SpendFixer doesn't just track. It fixes.</p>
              <p class="mt-2 max-w-lg text-brand-200">
                AI finds what's costing you money — unused subscriptions, bad rates, idle cash — and gives you one-tap actions to fix it. Starting free.
              </p>
            </div>
            <NuxtLink
              to="/signup"
              class="inline-flex shrink-0 items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:shadow-lg"
            >
              Try it free →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section id="how" class="bg-brand-950 py-24 lg:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-400">How it works</p>
          <h2 class="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            Connect. Discover. Fix.<br>Repeat daily in 60 seconds.
          </h2>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-3">
          <div
            v-for="item in howItWorks"
            :key="item.step"
            class="relative"
          >
            <p class="font-display text-6xl font-bold text-brand-800/40">{{ item.step }}</p>
            <h3 class="mt-2 font-display text-xl font-bold text-white">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-gray-400">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 lg:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <div class="lg:col-span-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-brand-600">What you get</p>
            <h2 class="mt-4 font-display text-4xl font-bold text-brand-950 sm:text-5xl">
              A financial agent,<br>not another dashboard.
            </h2>
            <p class="mt-5 text-lg leading-relaxed text-gray-600">
              SpendFixer doesn't just show you charts. It finds problems, suggests fixes, and lets you act — all in 60 seconds a day.
            </p>
            <NuxtLink
              to="/signup"
              class="mt-8 inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
            >
              Start for free →
            </NuxtLink>
          </div>
          <div class="space-y-5 lg:col-span-7">
            <div class="grid gap-5 sm:grid-cols-2">
              <div class="rounded-2xl border border-gray-200 bg-white p-6">
                <p class="font-display text-lg font-bold text-brand-950">"Fix it" actions</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">Cancel subscriptions, switch to better rates, move idle cash — one tap. We don't just show you the problem, we solve it.</p>
              </div>
              <div class="rounded-2xl border border-gray-200 bg-white p-6">
                <p class="font-display text-lg font-bold text-brand-950">Daily digest</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">One screen, one minute. What you spent, what changed, what to fix. Three bullets. Done.</p>
              </div>
            </div>
            <div class="grid gap-5 sm:grid-cols-5">
              <div class="rounded-2xl border border-gray-200 bg-white p-6 sm:col-span-3">
                <p class="font-display text-lg font-bold text-brand-950">AI spending agent</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">Detects unused subscriptions, spots overspending before it happens, and finds savings opportunities you'd never catch manually.</p>
              </div>
              <div class="rounded-2xl border border-gray-200 bg-white p-6 sm:col-span-2">
                <p class="font-display text-lg font-bold text-brand-950">Bank sync</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">Powered by Plaid. Connect once, stay connected.</p>
              </div>
            </div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div class="rounded-2xl border border-gray-200 bg-white p-6">
                <p class="font-display text-lg font-bold text-brand-950">Couples mode</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">Shared visibility into household spending. Both partners see the full picture. No more money arguments.</p>
              </div>
              <div class="rounded-2xl border border-gray-200 bg-white p-6">
                <p class="font-display text-lg font-bold text-brand-950">Works everywhere</p>
                <p class="mt-2 text-sm leading-relaxed text-gray-600">Desktop, tablet, phone. Install it like a native app. Android and iOS. No second-class citizens.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pricing" class="bg-white py-24 lg:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-600">Pricing</p>
          <h2 class="mt-4 font-display text-4xl font-bold text-brand-950 sm:text-5xl">
            Honest pricing.<br>No surprises.
          </h2>
          <p class="mt-5 text-lg leading-relaxed text-gray-600">
            The free plan is real budgeting — not a demo. Upgrade when you want AI that finds savings and fixes problems for you.
          </p>
        </div>

        <div class="mt-16 grid gap-6 lg:grid-cols-3">
          <div
            v-for="tier in pricingTiers"
            :key="tier.name"
            class="relative rounded-2xl p-8"
            :class="tier.highlighted
              ? 'bg-brand-600 text-white ring-4 ring-brand-600/20'
              : 'border border-gray-200 bg-white'"
          >
            <div v-if="tier.highlighted" class="absolute -top-3.5 left-8 rounded-full bg-brand-950 px-4 py-1 text-xs font-semibold text-white">
              Most popular
            </div>
            <p
              class="font-display text-lg font-bold"
              :class="tier.highlighted ? 'text-white' : 'text-brand-950'"
            >
              {{ tier.name }}
            </p>
            <div class="mt-4 flex items-baseline gap-1">
              <span
                class="font-display text-4xl font-bold"
                :class="tier.highlighted ? 'text-white' : 'text-brand-950'"
              >
                {{ tier.price }}
              </span>
              <span
                class="text-sm"
                :class="tier.highlighted ? 'text-brand-200' : 'text-gray-500'"
              >
                {{ tier.period }}
              </span>
            </div>
            <p
              v-if="tier.annual"
              class="mt-1 text-xs"
              :class="tier.highlighted ? 'text-brand-200' : 'text-brand-600'"
            >
              {{ tier.annual }}
            </p>
            <p
              class="mt-3 text-sm"
              :class="tier.highlighted ? 'text-brand-200' : 'text-gray-500'"
            >
              {{ tier.description }}
            </p>
            <ul class="mt-8 space-y-3">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-2.5 text-sm"
                :class="tier.highlighted ? 'text-brand-100' : 'text-gray-700'"
              >
                <svg
                  class="mt-0.5 h-4 w-4 flex-shrink-0"
                  :class="tier.highlighted ? 'text-brand-300' : 'text-brand-500'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>
            <button
              class="mt-8 w-full rounded-full px-4 py-3 text-sm font-semibold transition-all"
              :class="tier.highlighted
                ? 'bg-white text-brand-700 hover:bg-brand-50 hover:shadow-lg'
                : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20'"
            >
              {{ tier.cta }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 lg:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="overflow-hidden rounded-3xl bg-brand-950 px-8 py-16 sm:px-16 lg:px-24">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
              Your money deserves more than a pie chart.
            </h2>
            <p class="mt-4 text-brand-300">
              20 million people lost their budgeting app. We built something better — one that actually tells you what to fix.
            </p>
            <div v-if="!isSubmitted" class="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                v-model="email"
                type="email"
                placeholder="you@email.com"
                class="flex-1 rounded-full border border-brand-700 bg-brand-900 px-5 py-3.5 text-sm text-white placeholder-brand-500 transition-all focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-400/10"
                @keydown.enter="handleWaitlist"
              >
              <button
                :disabled="isLoading"
                class="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-800 transition-all hover:bg-brand-50 hover:shadow-lg disabled:opacity-50"
                @click="handleWaitlist"
              >
                Join waitlist
              </button>
            </div>
            <div v-else class="mx-auto mt-10 max-w-md rounded-2xl border border-brand-700 bg-brand-900 p-5">
              <p class="font-medium text-white">You're in. We'll be in touch soon.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 bg-cream py-10">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <img src="/logo.png" alt="SpendFixer" class="h-8">
          <div class="flex gap-6 text-sm text-gray-400">
            <NuxtLink to="/blog" class="hover:text-brand-600">Blog</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-brand-600">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-brand-600">Terms of Service</NuxtLink>
            <NuxtLink to="/contact" class="hover:text-brand-600">Contact</NuxtLink>
          </div>
          <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} SpendFixer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
