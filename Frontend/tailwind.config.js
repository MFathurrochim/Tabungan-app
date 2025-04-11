/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5D5CDE',
        secondary: '#4CAF50',
        success: '#4CAF50',
        danger: '#FF5252',
        warning: '#FFC107',
        dark: {
          DEFAULT: '#181818',
          light: '#2d2d2d'
        }
      }
    },
  },
  plugins: [],
}