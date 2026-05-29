/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand:        '#1B3A8C',
        'brand-dark': '#0F2460',
        'brand-mid':  '#2557C2',
        'brand-light':'#EBF2FF',
        dark:         '#1A202C',
        grey:         '#2D3748',
        'grey-mid':   '#4A5568',
        'grey-light': '#718096',
        'grey-border':'#E2E8F0',
        'grey-bg':    '#F7F8FC',
        'page':       '#F7F8FC',
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10)',
        'blue':  '0 4px 16px rgba(27,58,140,0.3)',
        'nav':   '0 1px 4px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
