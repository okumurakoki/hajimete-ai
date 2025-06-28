import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50, #eff6ff)',
          100: 'var(--color-primary-100, #dbeafe)',
          200: 'var(--color-primary-200, #bfdbfe)',
          300: 'var(--color-primary-300, #93c5fd)',
          400: 'var(--color-primary-400, #60a5fa)',
          500: 'var(--color-primary-500, #3b82f6)',
          600: 'var(--color-primary-600, #2563eb)',
          700: 'var(--color-primary-700, #1d4ed8)',
          800: 'var(--color-primary-800, #1e40af)',
          900: 'var(--color-primary-900, #1e3a8a)',
        },
        // ダークモード用のグレースケール
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontSize: {
        'theme-xs': ['calc(0.75rem * var(--font-scale, 1))', { lineHeight: '1rem' }],
        'theme-sm': ['calc(0.875rem * var(--font-scale, 1))', { lineHeight: '1.25rem' }],
        'theme-base': ['calc(1rem * var(--font-scale, 1))', { lineHeight: '1.5rem' }],
        'theme-lg': ['calc(1.125rem * var(--font-scale, 1))', { lineHeight: '1.75rem' }],
        'theme-xl': ['calc(1.25rem * var(--font-scale, 1))', { lineHeight: '1.75rem' }],
        'theme-2xl': ['calc(1.5rem * var(--font-scale, 1))', { lineHeight: '2rem' }],
        'theme-3xl': ['calc(1.875rem * var(--font-scale, 1))', { lineHeight: '2.25rem' }],
        'theme-4xl': ['calc(2.25rem * var(--font-scale, 1))', { lineHeight: '2.5rem' }],
      },
      animation: {
        'theme-transition': 'theme-transition 0.3s ease-in-out',
      },
      keyframes: {
        'theme-transition': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config