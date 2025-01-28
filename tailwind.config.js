/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000',
        text: '#fff',
        luminousGreen: '#00FF00',
        blue: '#1DA1F2',
      },
    },
  },
  plugins: [],
}
