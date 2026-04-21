/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem'
      },
      keyframes: {
        recenterPulse: {
           '0%, 100%': { transform: 'scale(1)' },
           '50%': { transform: 'scale(1.15)' },
        }
      },
      animation: {
        recenter: 'recenterPulse 0.8s ease-in-out',
      }
    },
  },
  plugins: [],
}