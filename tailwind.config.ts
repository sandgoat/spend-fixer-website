import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7f1',
          100: '#d8eadb',
          200: '#b2d5b8',
          300: '#7fb88a',
          400: '#4f9a5e',
          500: '#2d7a3e',
          600: '#1a5c2a',
          700: '#164d24',
          800: '#133d1e',
          900: '#0f3018',
          950: '#091e0f',
        },
        cream: '#faf8f5',
        sand: '#f2ede6',
      },
      fontSize: {
        '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        '7xl': ['4.75rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config
