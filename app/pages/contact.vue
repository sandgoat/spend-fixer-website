<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'Contact Us — SpendFixer',
  description: 'Get in touch with the SpendFixer team. We\'re here to help with questions about your account, billing, or anything else.',
  ogTitle: 'Contact Us — SpendFixer',
  ogDescription: 'Get in touch with the SpendFixer team.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}/contact`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Contact Us — SpendFixer',
  twitterDescription: 'Get in touch with the SpendFixer team.',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/contact` }],
})

// TODO: support@spendfixer.com needs to be configured before this goes live.
// Recommended: Zoho Mail (free tier supports custom domains) or Postmark for transactional.
// Zoho setup: https://www.zoho.com/mail/ — add MX records to your domain DNS.
</script>

<template>
  <div class="min-h-screen bg-cream">
    <!-- Nav -->
    <header class="border-b border-gray-200 bg-cream px-6 py-4">
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.png" alt="SpendFixer" class="h-8">
        </NuxtLink>
        <nav class="flex gap-6 text-sm text-gray-500">
          <NuxtLink to="/privacy" class="hover:text-brand-600">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-brand-600">Terms</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <div class="grid gap-16 lg:grid-cols-2">

        <!-- Left: contact info -->
        <div>
          <h1 class="font-display text-4xl font-bold text-brand-950">Get in touch</h1>
          <p class="mt-4 text-gray-500 leading-relaxed">
            Have a question, found a bug, or just want to say hi? Fill out the form or email us directly and we'll get back to you within one business day.
          </p>

          <div class="mt-8 space-y-4">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Support Email</p>
                <a href="mailto:support@spendfixer.com" class="text-sm text-brand-600 hover:text-brand-700">support@spendfixer.com</a>
              </div>
            </div>
          </div>

          <div class="mt-10 rounded-2xl bg-brand-50 p-6">
            <p class="text-sm font-medium text-brand-900">Legal</p>
            <div class="mt-3 flex flex-col gap-2 text-sm">
              <NuxtLink to="/privacy" class="text-brand-600 hover:text-brand-700 hover:underline">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms" class="text-brand-600 hover:text-brand-700 hover:underline">Terms of Service</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right: contact form -->
        <div>
          <form
            :action="`mailto:support@spendfixer.com`"
            method="post"
            enctype="text/plain"
            class="space-y-5"
          >
            <div>
              <label for="contact-name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                class="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              >
            </div>

            <div>
              <label for="contact-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                class="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              >
            </div>

            <div>
              <label for="contact-message" class="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="5"
                placeholder="What's on your mind?"
                class="mt-1.5 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
            >
              Send Message
            </button>

            <p class="text-center text-xs text-gray-400">
              This will open your email client. Prefer to email directly?
              <a href="mailto:support@spendfixer.com" class="text-brand-600 hover:underline">support@spendfixer.com</a>
            </p>
          </form>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-cream py-10">
      <div class="mx-auto max-w-4xl px-6 lg:px-10">
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <img src="/logo.png" alt="SpendFixer" class="h-8">
          <div class="flex gap-6 text-sm text-gray-400">
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
