<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'SpendFixer vs Rocket Money (2026) — Which Should You Use?',
  description: 'SpendFixer vs Rocket Money: a no-BS comparison of features, pricing, and what each app is actually good at. We cover bill negotiation, bank sync, and budgeting.',
  ogTitle: 'SpendFixer vs Rocket Money (2026)',
  ogDescription: 'Rocket Money negotiates bills. SpendFixer shows you where your money goes. Do you need both? Here\'s the honest answer.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}/compare/rocket-money`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/compare/rocket-money` }],
})

const features = [
  { feature: 'Price', spendfixer: 'Free / $7.99/mo', rocket: 'Free / $6–$12/mo + bill negotiation fees', winner: 'tie' },
  { feature: 'Bank sync', spendfixer: 'Yes (Plaid)', rocket: 'Yes (Plaid)', winner: 'tie' },
  { feature: 'Mobile app', spendfixer: 'Yes (PWA)', rocket: 'Yes (native iOS/Android)', winner: 'rocket' },
  { feature: 'Ease of use', spendfixer: 'Very simple — 60 sec/day', rocket: 'Simple but ad-heavy free tier', winner: 'spendfixer' },
  { feature: 'Bill negotiation', spendfixer: 'No', rocket: 'Yes (takes % of savings)', winner: 'rocket' },
  { feature: 'Subscription cancellation', spendfixer: 'No', rocket: 'Yes', winner: 'rocket' },
  { feature: 'Budgeting', spendfixer: 'Flexible categories', rocket: 'Basic budgets', winner: 'spendfixer' },
  { feature: 'Free plan quality', spendfixer: 'Full core features', rocket: 'Limited, lots of upsells', winner: 'spendfixer' },
  { feature: 'Privacy', spendfixer: 'No data selling', rocket: 'Owned by Rocket Companies', winner: 'spendfixer' },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-emerald-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">Comparison</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          SpendFixer vs Rocket Money
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Rocket Money is great at canceling subscriptions and negotiating bills.
          SpendFixer is great at showing you where your money actually goes.
          Here's how to decide which one you need.
        </p>
        <div class="mt-8 text-sm text-gray-500">
          <span>Updated February 2026</span>
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
                <th class="text-center px-6 py-4 font-semibold text-gray-600 w-1/3">Rocket Money</th>
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
                <td class="px-6 py-4 text-center" :class="row.winner === 'rocket' ? 'text-gray-900 font-semibold' : 'text-gray-500'">
                  <span v-if="row.winner === 'rocket'">✅ </span>{{ row.rocket }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm text-gray-500 text-center">
          Rocket Money's bill negotiation takes 30–60% of your first year's savings as a fee. Useful, but not "free."
        </p>
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
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You want daily spending clarity without a complicated dashboard</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You care about where your money goes, not just what subscriptions you have</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You want a genuinely useful free plan without constant upsells</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> Privacy matters — you'd rather not share your data with a mortgage company</li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gray-200">
            <div class="text-3xl mb-3">🚀</div>
            <h3 class="text-xl font-bold text-gray-700 mb-4">Choose Rocket Money if…</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You suspect you're paying for forgotten subscriptions</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You want someone to actually call your cable company and lower your bill</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You're okay with sharing data in exchange for those services</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> Bill negotiation savings will clearly outweigh their cut</li>
            </ul>
          </div>
        </div>

        <!-- Honest note -->
        <div class="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 class="font-semibold text-amber-900 mb-2">Honest take</h3>
          <p class="text-amber-800 text-sm leading-relaxed">
            These apps solve different problems. Rocket Money is a bill-reduction service with budgeting bolted on.
            SpendFixer is a spending awareness tool. You could use both — Rocket Money for a one-time subscription audit,
            SpendFixer for ongoing spending clarity. Or just use SpendFixer free and cancel your own subscriptions.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 bg-emerald-600 text-white text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-4">Try SpendFixer free — no credit card</h2>
        <p class="text-emerald-100 mb-8 text-lg">See exactly where your money goes in under 5 minutes. No upsells, no negotiation fees.</p>
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
