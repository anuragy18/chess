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
        glass: {
          light: 'rgba(255, 255, 255, 0.12)',
          dark: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.18)',
          glow: 'rgba(99, 102, 241, 0.25)',
        },
        chess: {
          gold: '#f59e0b',
          woodDark: '#b58863',
          woodLight: '#f0d9b5',
          onyxDark: '#262421',
          onyxLight: '#363431',
          cyberDark: '#1e1b4b',
          cyberLight: '#312e81',
          classicDark: '#769656',
          classicLight: '#eeeed2',
        }
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' },
        },
      }
    },
  },
  plugins: [],
}
