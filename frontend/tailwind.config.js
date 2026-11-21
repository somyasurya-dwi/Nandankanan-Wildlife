/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F9F4E8',
          200: '#F0E4C8',
          300: '#E4D1A3',
          400: '#D5BC7E',
          500: '#C8A96B', // Official Sanctuary Gold
          600: '#B08E4E',
          700: '#8C6E35',
          800: '#695123',
          900: '#473616',
          950: '#2A1F0B',
        },
        ivory: {
          50: '#FAF9F5',
          100: '#F5F4EA',
          200: '#EAE7D5',
          300: '#DBD7BD',
          400: '#C4BF9E',
          500: '#AAA480',
          600: '#88825F',
          700: '#686345',
          800: '#49452F',
          900: '#2E2B1B',
          950: '#17150B',
        },
        forest: {
          950: '#071810',
          900: '#0B2A1A', // Dark forest green
          800: '#14532D', // Primary forest green
          700: '#1B6537',
          600: '#2E7D32', // Mid green
          500: '#388E3C',
          400: '#66BB6A',
          300: '#A7D7A9', // Soft green
          100: '#Dcedd8',
          50: '#F0F7EF',
        },
        cream: {
          50: '#FAF8F3',
          100: '#F4F1E8', // Cream light background
          200: '#E8E3D5',
          300: '#DBD4C1',
        },
        tiger: {
          orange: '#F28C1B', // Key accent button
          hover: '#E07D10',
          amber: '#E5A836',
        },
        charcoal: {
          900: '#111612',
          800: '#202820',
          700: '#354035',
          600: '#526359',
          500: '#75887D',
          400: '#94A399',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Playfair Display"', '"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}

