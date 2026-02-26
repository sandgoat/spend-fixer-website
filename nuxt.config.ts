export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  app: {
    head: {
      title: 'SpendFixer',
    },
  },

  runtimeConfig: {
    plaidClientId: '',
    plaidSecret: '',
    plaidEnv: 'sandbox',
    public: {
      appName: 'SpendFixer',
    },
  },
})
