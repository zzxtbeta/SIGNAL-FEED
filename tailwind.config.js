/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      colors: {
        signal: {
          high: '#DC2626',
          mid: '#F59E0B',
          low: '#6B7280',
        },
        accent: '#EA580C',
      },
    },
  },
  plugins: [],
}
