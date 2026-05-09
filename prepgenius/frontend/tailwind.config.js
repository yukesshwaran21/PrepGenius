module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c7fe',
          300: '#a5a5fd',
          400: '#8179fa',
          500: '#6c5ef7',
          600: '#5b3eec',
          700: '#4d2fd6',
          800: '#4028ac',
          900: '#362488',
        },
        surface: {
          950: '#0a0a12',
          900: '#0f0f1a',
          800: '#13131f',
          750: '#17172d',
          700: '#1c1c30',
          600: '#232340',
          500: '#2d2d50',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6c5ef7 0%, #4f46e5 50%, #7c3aed 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(108,94,247,0.1) 0%, rgba(79,70,229,0.05) 100%)',
      },
      boxShadow: {
        'brand': '0 0 20px rgba(108, 94, 247, 0.3)',
        'brand-lg': '0 0 40px rgba(108, 94, 247, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
