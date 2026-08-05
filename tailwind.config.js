/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: '#173d2b',
        moss: '#687c45',
        signal: '#e96b32',
        ink: '#17201b',
        mist: '#f2f4ef',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['Arial Black', 'Inter', 'PingFang SC', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 50px rgba(23, 32, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
