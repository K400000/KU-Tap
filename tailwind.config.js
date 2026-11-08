/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Schedule canvas theme tokens (CSS custom properties)
        canvas: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'grid-line': 'var(--grid-line)',
          'grid-line-strong': 'var(--grid-line-strong)',
          'header-bg': 'var(--header-bg)',
          'header-text': 'var(--header-text)',
          'day-label-bg': 'var(--day-label-bg)',
          'day-label-text': 'var(--day-label-text)',
          text: 'var(--text)',
          'text-muted': 'var(--text-muted)',
          title: 'var(--title)',
          'break-bg': 'var(--break-bg)',
          'break-text': 'var(--break-text)',
          'collision-cell-bg': 'var(--collision-cell-bg)',
        },
      },
    },
  },
  plugins: [],
}

