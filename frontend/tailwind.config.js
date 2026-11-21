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
          900: '#071D12', // Deep forest background
          850: '#0B2A1A', // Card / panel forest
          800: '#123D2B', // Primary forest green
          700: '#1B6537',
          600: '#26734D', // Emerald accent
          500: '#2E7D32', // Mid green
          400: '#4CAF50',
          300: '#A7D7A9', // Soft green
          100: '#Dcedd8',
          50: '#F0F7EF',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F4ECD8',
          200: '#E9DBB7',
          300: '#DFCA99',
          400: '#D4B87A',
          500: '#C8A96B', // Signature Nandankanan Gold
          600: '#B89652',
          700: '#947539',
          800: '#715728',
          900: '#4E3A19',
        },
        ivory: {
          50: '#FAF9F4',
          100: '#F5F4EA', // Signature Ivory
          200: '#ECE9D8',
          300: '#DFDABF',
          400: '#CFC8A3',
          500: '#B8AF85',
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
        odia: ['"Noto Sans Oriya"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
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

