/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        bg: '#0f172a',
        surface: '#1e293b',
        'surface-light': '#334155'
      }
    }
  },
  plugins: []
}
