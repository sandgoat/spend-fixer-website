export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@vite-pwa/nuxt',
    '@nuxt/image',
  ],

  // Performance: payload extraction for faster hydration
  experimental: {
    payloadExtraction: true,
  },

  // Performance: compress public assets at build time
  nitro: {
    compressPublicAssets: true,
  },

  // Performance: prerender static marketing/content pages
  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/compare/**': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/contact': { prerender: true },
  },

  // Performance: image optimization config
  image: {
    quality: 80,
    format: ['webp', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  pwa: {
    manifest: {
      name: 'SpendFixer',
      short_name: 'SpendFixer',
      description: 'Fix your spending in 60 seconds a day.',
      theme_color: '#10b981',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/offline',
      navigateFallbackDenylist: [/^\/api\//],
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
      runtimeCaching: [
        // API calls — NetworkFirst (fresh data when online, cached fallback offline)
        {
          urlPattern: /^\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'sf-api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Static assets — CacheFirst
        {
          urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'sf-static-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Google Fonts — CacheFirst
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'sf-fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    devOptions: {
      enabled: false,
    },
  },

  content: {
    highlight: {
      theme: 'github-dark',
    },
  },

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
      // Performance: preconnect to Google Fonts
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Preload OG image for landing page
        { rel: 'preload', as: 'image', href: '/og-image.svg' },
      ],
    },
  },

  // Performance: CSS code splitting
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },

  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
    // AES-256-GCM key for encrypting Plaid access tokens at rest.
    // Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    plaidClientId: '',
    plaidSecret: '',
    plaidEnv: 'sandbox',
    public: {
      appName: 'SpendFixer',
    },
  },
})
