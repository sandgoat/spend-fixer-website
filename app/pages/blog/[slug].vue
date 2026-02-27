<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useSeoMeta({
  title: `${post.value?.title} — SpendFixer`,
  description: post.value?.description,
  ogTitle: post.value?.title,
  ogDescription: post.value?.description,
})

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

    <!-- Article -->
    <article class="pt-32 pb-24 lg:pt-40">
      <div class="mx-auto max-w-3xl px-6 lg:px-10">
        <!-- Breadcrumb -->
        <nav class="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-brand-700">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/blog" class="hover:text-brand-700">Blog</NuxtLink>
          <span>/</span>
          <span class="text-gray-400 truncate max-w-xs">{{ post?.title }}</span>
        </nav>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in post?.tags"
            :key="tag"
            class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Header -->
        <h1 class="font-display text-4xl font-bold text-brand-950 sm:text-5xl leading-tight">
          {{ post?.title }}
        </h1>
        <p class="mt-4 text-lg text-gray-600">{{ post?.description }}</p>

        <div class="mt-6 flex items-center gap-4 text-sm text-gray-400 border-b border-gray-200 pb-8">
          <span v-if="post?.author">By {{ post.author }}</span>
          <span v-if="post?.date">{{ formatDate(post.date) }}</span>
        </div>

        <!-- Content -->
        <div class="mt-10 prose prose-lg prose-brand max-w-none">
          <ContentRenderer v-if="post" :value="post" />
        </div>

        <!-- CTA -->
        <div class="mt-16 rounded-3xl bg-brand-600 p-8 text-center">
          <h2 class="font-display text-2xl font-bold text-white">Stop tracking. Start fixing.</h2>
          <p class="mt-2 text-brand-100">SpendFixer tells you exactly what to fix — and lets you do it in one tap.</p>
          <NuxtLink
            to="/"
            class="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50 hover:shadow-lg"
          >
            Try SpendFixer Free →
          </NuxtLink>
        </div>

        <!-- Back to blog -->
        <div class="mt-10 text-center">
          <NuxtLink to="/blog" class="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← Back to all posts
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>
