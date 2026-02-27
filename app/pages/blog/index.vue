<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Blog — SpendFixer',
  description: 'Personal finance tips, budgeting app comparisons, and practical advice to help you fix your spending.',
  ogTitle: 'Blog — SpendFixer',
  ogDescription: 'Personal finance tips, budgeting app comparisons, and practical advice to help you fix your spending.',
})

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="bg-cream min-h-screen">
    <!-- Nav -->
    <nav class="fixed top-0 z-50 w-full bg-cream/90 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <NuxtLink to="/" class="shrink-0">
          <img src="/logo.png" alt="SpendFixer" class="h-8 sm:h-10">
        </NuxtLink>
        <div class="hidden items-center gap-10 md:flex">
          <NuxtLink to="/" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-700">Home</NuxtLink>
          <NuxtLink to="/blog" class="text-sm font-medium text-brand-700">Blog</NuxtLink>
        </div>
        <div class="flex items-center gap-3 sm:gap-4">
          <NuxtLink to="/login" class="hidden text-sm font-medium text-gray-600 transition-colors hover:text-brand-700 sm:block">
            Log in
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
          >
            Get Started Free
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <p class="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700">
          Blog
        </p>
        <h1 class="mt-6 font-display text-4xl font-bold text-brand-950 sm:text-5xl">
          Personal Finance, Simplified
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-gray-600">
          Honest takes on budgeting apps, spending habits, and actually fixing your finances — without the fluff.
        </p>
      </div>
    </section>

    <!-- Posts -->
    <section class="pb-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div v-if="posts && posts.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="post in posts"
            :key="post.path"
            :to="post.path"
            class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
          >
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in post.tags?.slice(0, 2)"
                :key="tag"
                class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {{ tag }}
              </span>
            </div>
            <h2 class="font-display text-xl font-bold text-brand-950 group-hover:text-brand-700 transition-colors leading-snug">
              {{ post.title }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-gray-600 flex-1">
              {{ post.description }}
            </p>
            <div class="mt-5 flex items-center justify-between">
              <time class="text-xs text-gray-400">{{ formatDate(post.date) }}</time>
              <span class="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Read more →</span>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="py-20 text-center text-gray-500">
          <p>No posts yet. Check back soon.</p>
        </div>

        <!-- CTA -->
        <div class="mt-20 rounded-3xl bg-brand-600 p-10 text-center">
          <h2 class="font-display text-3xl font-bold text-white">Ready to fix your spending?</h2>
          <p class="mt-3 text-brand-100">Join thousands of people who stopped guessing and started fixing.</p>
          <NuxtLink
            to="/"
            class="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:shadow-lg"
          >
            Try SpendFixer Free →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
