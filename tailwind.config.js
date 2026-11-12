/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { pastel: { pink: '#FDF2F8', rose: '#FFE4E6', beige: '#FDF8F5', brown: '#8B5A2B' } },
      keyframes: {
        'fade-in-up': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        'pop': { '0%': { transform: 'scale(.9)' }, '60%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: { 'fade-in-up': 'fade-in-up .35s ease-out', pop: 'pop .3s ease-out' },
    },
  },
  plugins: [],
}