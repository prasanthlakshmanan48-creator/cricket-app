import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          950: '#0a0d12',
          900: '#111620',
          850: '#171e2c',
          800: '#1e2638',
          700: '#2b364e',
          600: '#3e4d6d',
          500: '#586b94',
        },
        pitch: {
          dark: '#0f2419',
          emerald: '#10b981',
          gold: '#f59e0b',
          amber: '#d97706',
          accent: '#00f2fe',
        },
        cricket: {
          gold: '#eab308',
          red: '#ef4444',
          green: '#22c55e',
          gray: '#9ca3af',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'stadium-gradient': 'radial-gradient(ellipse at top, #1e2638 0%, #0a0d12 70%)',
        'pitch-glow': 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        'gold-glow': 'radial-gradient(circle at center, rgba(245, 158, 11, 0.2) 0%, transparent 65%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'row-slide': 'rowSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-pop': 'revealPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        rowSlide: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealPop: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
