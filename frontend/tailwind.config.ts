import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        charcoal: '#242424',
        midnight: '#111111',
        'mid-gray': '#898989',
      },
      letterSpacing: {
        display: '-0.03em',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
