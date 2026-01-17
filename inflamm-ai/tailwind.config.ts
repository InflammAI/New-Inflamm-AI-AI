import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: '#FFF9F3',
        'dark-gray': '#2C2C2C', // Dark gray for text
        'muted-gray': '#6B6B6B', // Medium gray for secondary text
        'primary-orange': '#D84315', // Deep orange matching logo
        'accent-orange': '#FF6F00', // Bright orange
        // Inflamm AI app colors
        'inflamm': {
          'orange': '#FF8A00',
          'yellow': '#FFD400',
          'surface': '#0F1720',
          'bg': '#0B0F14',
          'muted': '#98A1AD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
