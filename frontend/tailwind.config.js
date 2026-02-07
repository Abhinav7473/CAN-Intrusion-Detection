/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anomaly': {
          'critical': '#EF4444',
          'high': '#F59E0B',
          'medium': '#FCD34D',
          'low': '#10B981',
          'normal': '#3B82F6',
        },
        'background': {
          'dark': '#0f172a',
          'card': '#1e293b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}