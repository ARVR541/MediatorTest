import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accentDeep: 'rgb(var(--color-accent-deep) / <alpha-value>)',
        accentGold: 'rgb(var(--color-accent-gold) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Lora', 'Georgia', 'serif'],
        body: ['Manrope', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 30px -18px rgba(19, 50, 76, 0.35)',
        card: '0 24px 60px -30px rgba(19, 50, 76, 0.22)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
};

export default config;
