/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      navy: '#002649',
      gold: '#a89469',
      white: '#e2e8f0',
      gray1: '#475569',
    },
    extend: { fontFamily: { Manrope: ['Manrope'] } },
  },
  height: { screen: '100dvh' },

  plugins: [],
};
