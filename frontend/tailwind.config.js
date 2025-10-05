/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // AQI Status Colors (minimal, blue-based)
        aqi: {
          good: '#10b981',      // Green (keep for good air)
          satisfactory: '#3b82f6', // Blue
          moderate: '#f59e0b',     // Amber (minimal use)
          poor: '#ef4444',         // Red (keep for danger)
          veryPoor: '#7c3aed',     // Purple
          severe: '#dc2626'        // Dark red (keep for severe)
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        'gradient-light': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      }
    },
  },
  plugins: [],
}
