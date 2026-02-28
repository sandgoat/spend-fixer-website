<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'SpendFixer vs YNAB (2026) — Which Budgeting App Is Right for You?',
  description: 'Comparing SpendFixer vs YNAB: pricing, features, ease of use, and who each app is really for. Honest breakdown with no fluff.',
  ogTitle: 'SpendFixer vs YNAB (2026)',
  ogDescription: 'SpendFixer vs YNAB: an honest feature-by-feature comparison. Find out which budgeting app fits your life.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}/compare/ynab`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/compare/ynab` }],
})

const features = [
  { feature: 'Price', spendfixer: 'Free / $7.99/mo', ynab: '$14.99/mo', winner: 'spendfixer' },
  { feature: 'Bank sync', spendfixer: 'Yes (Plaid)', ynab: 'Yes (Plaid)', winner: 'tie' },
  { feature: 'Mobile app', spendfixer: 'Yes (PWA)', ynab: 'Yes (native iOS/Android)', winner: 'ynab' },
  { feature: 'Ease of use', spendfixer: 'Very easy — 60 sec/day', ynab: 'Steep learning curve', winner: 'spendfixer' },
  { feature: 'Budgeting method', spendfixer: 'Flexible categories', ynab: 'Zero-based envelope', winner: 'tie' },
  { feature: 'Goals tracking', spendfixer: 'Yes (Plus/Pro)', ynab: 'Yes', winner: 'tie' },
  { feature: 'Free trial', spendfixer: 'Free plan forever', ynab: '34-day trial', winner: 'spendfixer' },
  { feature: 'Setup time', spendfixer: 'Under 5 minutes', ynab: '1–2 hours', winner: 'spendfixer' },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-emerald-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">Comparison</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          SpendFixer vs YNAB
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          YNAB is powerful. It's also $180/year and takes serious time to set up.
          Here's an honest look at whether that tradeoff makes sense for you.
        </p>
        <div class="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Updated February 2026</span>
          <span>·</span>
          <NuxtLink to="/blog/ynab-vs-spendfixer" class="text-emerald-600 hover:underline">Read our full YNAB deep-dive →</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Feature Comparison</h2>
        <div class="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left px-6 py-4 font-semibold text-gray-700 w-1/3">Feature</th>
                <th class="text-center px-6 py-4 font-semibold text-emerald-700 w-1/3">
                  <span class="inline-flex items-center gap-1">⚡ SpendFixer</span>
                </th>
                <th class="text-center px-6 py-4 font-semibold text-gray-600 w-1/3">YNAB</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in features"
                :key="i"
                :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                class="border-b border-gray-100 last:border-0"
              >
                <td class="px-6 py-4 font-medium text-gray-800">{{ row.feature }}</td>
                <td class="px-6 py-4 text-center" :class="row.winner === 'spendfixer' ? 'text-emerald-700 font-semibold' : 'text-gray-600'">
                  <span v-if="row.winner === 'spendfixer'">✅ </span>{{ row.spendfixer }}
                </td>
                <td class="px-6 py-4 text-center" :class="row.winner === 'ynab' ? 'text-gray-900 font-semibold' : 'text-gray-500'">
                  <span v-if="row.winner === 'ynab'">✅ </span>{{ row.ynab }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Who it's for -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-10 text-center">Who Is Each App For?</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl p-8 border border-emerald-200">
            <div class="text-3xl mb-3">⚡</div>
            <h3 class="text-xl font-bold text-emerald-700 mb-4">Choose SpendFixer if…</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You want to see where your money goes without a PhD in budgeting</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You don't want to pay $15/month for a budgeting app</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You've tried YNAB and gave up within a week</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You want a daily 60-second check-in, not a second job</li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gray-200">
            <div class="text-3xl mb-3">📊</div>
            <h3 class="text-xl font-bold text-gray-700 mb-4">Choose YNAB if…</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You're serious about zero-based budgeting and love envelope systems</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You're paying off debt and need granular control over every dollar</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You've used YNAB before and already know the method</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> The $180/year is worth it for the accountability features</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 bg-emerald-600 text-white text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-4">Try SpendFixer free — no credit card</h2>
        <p class="text-emerald-100 mb-8 text-lg">Connect your bank, see your spending in 60 seconds. No setup marathon required.</p>
        <NuxtLink
          to="/signup"
          class="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-emerald-50 transition"
        >
          Get started free
        </NuxtLink>
        <p class="mt-4 text-emerald-200 text-sm">Free plan available forever. No trial expiration.</p>
      </div>
    </section>
  </div>
</template>
