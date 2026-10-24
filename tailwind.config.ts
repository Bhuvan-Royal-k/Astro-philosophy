import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#04060F',
          DEFAULT: '#080B1A', // Midnight navy
          900: '#0C1026',
          800: '#121838',
        },
        cosmic: {
          950: '#0F0E20',
          DEFAULT: '#17152F', // Cosmic indigo
          900: '#1F1C3F',
          800: '#2A2754',
          700: '#3D3976',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F4ECE0',
          200: '#E7D8BD',
          300: '#DFC283',
          400: '#D3B16F',
          DEFAULT: '#C6A15B', // Antique gold
          600: '#B08B46',
          700: '#8E7036',
          800: '#6C5427',
          900: '#4A3919',
        },
        ivory: {
          DEFAULT: '#F4EFE4', // Warm ivory
          muted: '#DED8CC',
          dark: '#B8B2A6',
        },
        lavender: {
          DEFAULT: '#A9A5C5', // Muted lavender
          light: '#C7C4DC',
          dark: '#7D78A0',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(198, 161, 91, 0.25)',
        'gold-glow-lg': '0 0 45px -5px rgba(198, 161, 91, 0.35)',
        'cosmic': '0 10px 30px -10px rgba(8, 11, 26, 0.8)',
      },
      backgroundImage: {
        'cosmic-radial': 'radial-gradient(circle at 50% 30%, rgba(23, 21, 47, 0.8) 0%, rgba(8, 11, 26, 0.98) 75%)',
        'gold-gradient': 'linear-gradient(135deg, #DFC283 0%, #C6A15B 50%, #8E7036 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, rgba(223, 194, 131, 0.15) 0%, rgba(198, 161, 91, 0.05) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
