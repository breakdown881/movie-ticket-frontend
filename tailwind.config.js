/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          gold: '#F59E0B',
          red: '#E50914',
          neon: '#6366F1',
        },
        seat: {
          available: '#334155',
          selected: '#6366F1',
          held: '#F59E0B',
          confirmed: '#1E293B',
          vip: '#D97706',
          couple: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px -5px rgba(229, 9, 20, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'screen-glow': '0 15px 35px -5px rgba(99, 102, 241, 0.35)',
      }
    },
  },
  plugins: [],
}
