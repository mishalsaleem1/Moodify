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
        // Moodify Cosmic Purple Theme
        cosmic: {
          darker: '#0f0b1f',
          dark: '#1a0d2e',
          purple: '#7c3aed',
          light: '#a78bfa',
          blue: '#6366f1',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
          primary: '#e4e4ff',
          secondary: '#a8a8d1',
          heading: '#ffffff',
        },
        // Mood-based dynamic colors
        mood: {
          happy: '#f59e0b',
          sad: '#3b82f6',
          calm: '#10b981',
          angry: '#ef4444',
          energetic: '#ec4899',
          romantic: '#f43f5e',
        },
        // Emotion-based color palette
        happy: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          300: '#FCD34D',
          500: '#FFD700',
          700: '#FF8C00',
          900: '#D97706',
        },
        sad: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          300: '#93C5FD',
          500: '#3B82F6',
          700: '#1E3A8A',
          900: '#1E3A8A',
        },
        calm: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          300: '#6EE7B7',
          500: '#10B981',
          700: '#047857',
          900: '#064E3B',
        },
        angry: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          300: '#FCA5A5',
          500: '#EF4444',
          700: '#DC2626',
          900: '#7F1D1D',
        },
        excited: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          300: '#F9A8D4',
          500: '#EC4899',
          700: '#BE185D',
          900: '#831843',
        },
        peaceful: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          300: '#D8B4FE',
          500: '#C084FC',
          700: '#9333EA',
          900: '#581C87',
        },
        anxious: {
          50: '#FEF3C7',
          100: '#FDE68A',
          300: '#FCD34D',
          500: '#F59E0B',
          700: '#D97706',
          900: '#78350F',
        },
        nostalgic: {
          50: '#FDF4FF',
          100: '#FAE8FF',
          300: '#F0ABFC',
          500: '#D946EF',
          700: '#A21CAF',
          900: '#701A75',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'Inter', 'sans-serif'],
        clash: ['Clash Display', 'Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
