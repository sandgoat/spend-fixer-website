<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'SpendFixer vs Monarch Money (2026) — Honest Comparison',
  description: 'SpendFixer vs Monarch Money: pricing, features, ease of use, and who each app is actually built for. No sponsor bias.',
  ogTitle: 'SpendFixer vs Monarch Money (2026)',
  ogDescription: 'Is Monarch Money worth $14.99/month? See how it stacks up against SpendFixer in this honest side-by-side.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}/compare/monarch`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/compare/monarch` }],
})

const features = [
  { feature: 'Price', spendfixer: 'Free / $7.99/mo', monarch: '$14.99/mo', winner: 'spendfixer' },
  { feature: 'Bank sync', spendfixer: 'Yes (Plaid)', monarch: 'Yes (Plaid + Finicity)', winner: 'monarch' },
  { feature: 'Mobile app', spendfixer: 'Yes (PWA)', monarch: 'Yes (native iOS/Android)', winner: 'monarch' },
  { feature: 'Ease of use', spendfixer: 'Very easy — 60 sec/day', monarch: 'Moderate — feature-heavy', winner: 'spendfixer' },
  { feature: 'Net worth tracking', spendfixer: 'Basic (Pro)', monarch: 'Yes (full)', winner: 'monarch' },
  { feature: 'Budgeting', spendfixer: 'Flexible categories', monarch: 'Flexible + rollover', winner: 'tie' },
  { feature: 'Goals tracking', spendfixer: 'Yes (Plus/Pro)', monarch: 'Yes', winner: 'tie' },
  { feature: 'Free plan', spendfixer: 'Yes — forever', monarch: 'No (7-day trial only)', winner: 'spendfixer' },
  { feature: 'Setup time', spendfixer: 'Under 5 minutes', monarch: '15–30 minutes', winner: 'spendfixer' },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-emerald-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">Comparison</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          SpendFixer vs Monarch Money
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Monarch is the closest thing to a Mint replacement. It's polished, powerful,
          and $180/year. Here's whether that price tag is worth it for you.
        </p>
        <div class="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Updated February 2026</span>
          <span>·</span>
          <NuxtLink to="/blog/monarch-money-review-2026" class="text-emerald-600 hover:underline">Read our full Monarch review →</NuxtLink>
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
                <th class="text-center px-6 py-4 font-semibold text-gray-600 w-1/3">Monarch Money</th>
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
                <td class="px-6 py-4 text-center" :class="row.winner === 'monarch' ? 'text-gray-900 font-semibold' : 'text-gray-500'">
                  <span v-if="row.winner === 'monarch'">✅ </span>{{ row.monarch }}
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
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You want simple spending awareness, not a full financial dashboard</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You're not ready to pay $15/month yet (or ever)</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You just want to know where your money is going each week</li>
              <li class="flex gap-2"><span class="text-emerald-500 mt-0.5">✓</span> You abandoned Mint and haven't found a worthy replacement</li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gray-200">
            <div class="text-3xl mb-3">👑</div>
            <h3 class="text-xl font-bold text-gray-700 mb-4">Choose Monarch if…</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You want the most polished Mint replacement available</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You track investments, net worth, and multiple accounts</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> You want collaborative budgeting with a partner</li>
              <li class="flex gap-2"><span class="text-gray-400 mt-0.5">✓</span> $180/year feels fair for a premium finance tool</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 bg-emerald-600 text-white text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-4">Try SpendFixer free — no credit card</h2>
        <p class="text-emerald-100 mb-8 text-lg">Connect your bank, get a clear spending snapshot in under 5 minutes. No monthly bill.</p>
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
