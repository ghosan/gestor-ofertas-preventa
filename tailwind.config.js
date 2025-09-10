/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { backgroundColor: '#fef3c7' },
          '51%, 100%': { backgroundColor: '#fde68a' },
        }
      }
    },
  },
  plugins: [],
}
