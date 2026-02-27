<script setup lang="ts">
definePageMeta({ layout: 'default' })

const siteUrl = 'https://spendfixer.com'

useSeoMeta({
  title: 'Privacy Policy — SpendFixer',
  description: 'Read the SpendFixer Privacy Policy to understand how we collect, use, and protect your personal and financial information.',
  ogTitle: 'Privacy Policy — SpendFixer',
  ogDescription: 'How SpendFixer handles your personal and financial data.',
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}/privacy`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Privacy Policy — SpendFixer',
  twitterDescription: 'How SpendFixer handles your personal and financial data.',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/privacy` }],
})
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
          <NuxtLink to="/terms" class="hover:text-brand-600">Terms</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-brand-600">Contact</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <h1 class="font-display text-4xl font-bold text-brand-950">Privacy Policy</h1>
      <p class="mt-3 text-sm text-gray-400">Last updated: February 27, 2026</p>

      <div class="mt-10 space-y-10 text-gray-700">

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">1. Introduction</h2>
          <p class="mt-3 leading-relaxed">
            SpendFixer ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use SpendFixer, including our website and mobile/web application (collectively, the "Service"). Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">2. Information We Collect</h2>
          <div class="mt-3 space-y-4 leading-relaxed">
            <div>
              <h3 class="font-semibold text-gray-900">Account Information</h3>
              <p class="mt-1">When you create an account, we collect your name, email address, and a hashed password. We never store your password in plain text.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Financial Data (via Plaid)</h3>
              <p class="mt-1">When you connect a bank account, we use Plaid to retrieve your financial data. This includes account balances, transaction history, account names and numbers (last 4 digits), and institution names. We do not receive or store your full bank login credentials — those are handled exclusively by Plaid.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Usage Data</h3>
              <p class="mt-1">We collect information about how you interact with the Service, including pages viewed, features used, and session duration. This helps us improve the product.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Device & Technical Data</h3>
              <p class="mt-1">We automatically collect IP address, browser type, operating system, and referring URLs when you access the Service.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">3. How We Use Your Information</h2>
          <ul class="mt-3 list-inside list-disc space-y-2 leading-relaxed">
            <li>Provide, operate, and maintain the Service</li>
            <li>Analyze your spending patterns and generate personalized insights and recommendations</li>
            <li>Detect and alert you to unusual transactions, subscriptions, and recurring charges</li>
            <li>Send transactional emails (account confirmations, password resets, important service notices)</li>
            <li>Respond to your support requests</li>
            <li>Improve and develop new features based on aggregate usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p class="mt-4 leading-relaxed">We do not sell your personal data to third parties. We do not use your financial data for advertising purposes.</p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">4. Plaid and Bank Connection</h2>
          <p class="mt-3 leading-relaxed">
            SpendFixer uses <strong>Plaid Technologies, Inc.</strong> to connect to your financial institutions. When you link a bank account, you are also agreeing to Plaid's terms and privacy practices. Plaid has its own privacy policy that governs how it handles your data.
          </p>
          <p class="mt-3 leading-relaxed">
            We strongly encourage you to review the
            <a href="https://plaid.com/legal/end-user-privacy-policy/" target="_blank" rel="noopener noreferrer" class="font-medium text-brand-600 underline hover:text-brand-700">Plaid End User Privacy Policy</a>
            before connecting your bank accounts.
          </p>
          <p class="mt-3 leading-relaxed">
            SpendFixer receives read-only access to your account data through Plaid. We store transaction records and balance snapshots on our servers to power the Service's features. We do not have the ability to move money or initiate transactions on your behalf unless you explicitly authorize a specific action.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">5. Data Sharing and Disclosure</h2>
          <div class="mt-3 space-y-4 leading-relaxed">
            <p>We do not sell, trade, or rent your personal information. We may share your data only in these limited circumstances:</p>
            <ul class="list-inside list-disc space-y-2">
              <li><strong>Service Providers:</strong> Trusted third-party vendors (hosting, email delivery, analytics) who process data on our behalf under strict confidentiality agreements.</li>
              <li><strong>Legal Requirements:</strong> If required by law, subpoena, or other legal process, or to protect the rights and safety of SpendFixer, our users, or the public.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate notice to you.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">6. Data Retention</h2>
          <p class="mt-3 leading-relaxed">
            We retain your personal data and financial transaction history for as long as your account is active. If you delete your account, we will permanently delete your personal data and associated financial records within <strong>90 days</strong> of account deletion. Some anonymized, aggregated data (not linked to you) may be retained for product improvement purposes.
          </p>
          <p class="mt-3 leading-relaxed">
            You may request deletion of your account and data at any time by emailing <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a>.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">7. Data Security</h2>
          <p class="mt-3 leading-relaxed">
            We implement industry-standard security measures to protect your information, including encryption in transit (TLS) and at rest, regular security reviews, and access controls limiting employee access to user data. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">8. Your Rights</h2>
          <p class="mt-3 leading-relaxed">Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul class="mt-3 list-inside list-disc space-y-2 leading-relaxed">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
            <li><strong>Portability:</strong> Request an export of your data in a machine-readable format.</li>
            <li><strong>Opt-Out:</strong> Opt out of non-essential communications at any time via email unsubscribe or by contacting us.</li>
          </ul>
          <p class="mt-4 leading-relaxed">To exercise any of these rights, contact us at <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a>. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">9. Children's Privacy</h2>
          <p class="mt-3 leading-relaxed">
            SpendFixer is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such data, please contact us immediately at <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a>.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">10. Changes to This Policy</h2>
          <p class="mt-3 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and, where appropriate, sending an email to the address on file. Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">11. Contact Us</h2>
          <p class="mt-3 leading-relaxed">
            Questions about this Privacy Policy? Reach out:<br>
            <strong>SpendFixer</strong><br>
            Email: <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a>
          </p>
        </section>

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
