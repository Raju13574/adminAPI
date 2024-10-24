module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple': {
          900: '#2D1B54',
          950: '#1E0E3E',
        },
        'pink': {
          500: '#E91E63',
          900: '#880E4F',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
