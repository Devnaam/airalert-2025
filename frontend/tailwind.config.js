/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#00e400',
          satisfactory: '#ffff00', 
          moderate: '#ff7e00',
          poor: '#ff0000',
          veryPoor: '#8f3f97',
          severe: '#7e0023'
        }
      }
    },
  },
  plugins: [],
}
