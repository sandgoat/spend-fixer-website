<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Terms of Service — SpendFixer' })
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
          <NuxtLink to="/contact" class="hover:text-brand-600">Contact</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <h1 class="font-display text-4xl font-bold text-brand-950">Terms of Service</h1>
      <p class="mt-3 text-sm text-gray-400">Last updated: February 27, 2026</p>

      <div class="mt-10 space-y-10 text-gray-700">

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">1. Acceptance of Terms</h2>
          <p class="mt-3 leading-relaxed">
            By accessing or using SpendFixer ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and SpendFixer. We may update these Terms at any time; continued use after changes are posted constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">2. Description of Service</h2>
          <p class="mt-3 leading-relaxed">
            SpendFixer is a personal finance application that connects to your bank accounts (via Plaid), analyzes your spending, and provides actionable recommendations to help you spend less and save more. The Service includes transaction tracking, budget analysis, subscription detection, and related financial insights.
          </p>
          <p class="mt-3 leading-relaxed">
            SpendFixer is a financial information tool, not a licensed financial advisor, broker, or bank. Nothing in the Service constitutes financial, investment, legal, or tax advice. Always consult a qualified professional for major financial decisions.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">3. User Accounts</h2>
          <p class="mt-3 leading-relaxed">
            To use SpendFixer, you must create an account with a valid email address. You are responsible for:
          </p>
          <ul class="mt-3 list-inside list-disc space-y-2 leading-relaxed">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activity that occurs under your account</li>
            <li>Providing accurate, current, and complete account information</li>
            <li>Notifying us immediately of any unauthorized access at <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a></li>
          </ul>
          <p class="mt-3 leading-relaxed">
            You must be at least 18 years old to create an account. By creating an account, you represent that you are 18 or older.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">4. Prohibited Uses</h2>
          <p class="mt-3 leading-relaxed">You agree not to:</p>
          <ul class="mt-3 list-inside list-disc space-y-2 leading-relaxed">
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation</li>
            <li>Attempt to gain unauthorized access to any part of the Service or its related systems</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Scrape, crawl, or use automated tools to extract data from the Service</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Transmit malware, viruses, or other harmful code</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Use another user's account without permission</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">5. Bank Connection and Plaid</h2>
          <p class="mt-3 leading-relaxed">
            SpendFixer uses <strong>Plaid Technologies, Inc.</strong> to connect to your financial institutions. By connecting a bank account, you also agree to <a href="https://plaid.com/legal/" target="_blank" rel="noopener noreferrer" class="font-medium text-brand-600 underline hover:text-brand-700">Plaid's Terms of Service</a> and <a href="https://plaid.com/legal/end-user-privacy-policy/" target="_blank" rel="noopener noreferrer" class="font-medium text-brand-600 underline hover:text-brand-700">End User Privacy Policy</a>.
          </p>
          <p class="mt-3 leading-relaxed">
            You authorize SpendFixer to access your financial account data through Plaid on a read-only basis for the purpose of providing the Service. This authorization is revocable at any time by disconnecting your bank account in the Settings section of the app.
          </p>
          <p class="mt-3 leading-relaxed">
            SpendFixer is not responsible for any acts or omissions of Plaid or your financial institution. Bank connection availability depends on your institution's compatibility with Plaid and may be subject to interruption.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">6. Intellectual Property</h2>
          <p class="mt-3 leading-relaxed">
            All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are owned by SpendFixer and protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">7. Disclaimers</h2>
          <p class="mt-3 leading-relaxed">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p class="mt-3 leading-relaxed">
            We do not warrant that: (a) the Service will be uninterrupted or error-free; (b) any defects will be corrected; (c) the Service is free of viruses or harmful components; or (d) financial data will be accurate, complete, or current at all times. Transaction data is sourced from your financial institution via Plaid and may be delayed or incomplete.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">8. Limitation of Liability</h2>
          <p class="mt-3 leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SPENDFIXER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
          </p>
          <p class="mt-3 leading-relaxed">
            IN NO EVENT WILL SPENDFIXER'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $50.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">9. Indemnification</h2>
          <p class="mt-3 leading-relaxed">
            You agree to indemnify, defend, and hold harmless SpendFixer and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">10. Termination</h2>
          <p class="mt-3 leading-relaxed">
            You may terminate your account at any time by contacting us at <a href="mailto:support@spendfixer.com" class="font-medium text-brand-600 hover:text-brand-700">support@spendfixer.com</a>. We may suspend or terminate your account immediately, without notice, if you violate these Terms or if we determine, in our sole discretion, that continued access is harmful to the Service or its users.
          </p>
          <p class="mt-3 leading-relaxed">
            Upon termination, your right to use the Service ceases immediately. Provisions of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">11. Governing Law</h2>
          <p class="mt-3 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of <strong>Texas</strong>, without regard to its conflict of law provisions. Any dispute arising from these Terms or your use of the Service shall be resolved exclusively in the state or federal courts located in Texas, and you consent to personal jurisdiction in those courts.
          </p>
        </section>

        <section>
          <h2 class="font-display text-xl font-semibold text-brand-950">12. Contact</h2>
          <p class="mt-3 leading-relaxed">
            Questions about these Terms?<br>
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
