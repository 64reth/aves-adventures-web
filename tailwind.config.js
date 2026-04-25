/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        avePink: '#f44b91',
        aveHotPink: '#e82e79',
        aveSoftPink: '#ffe8f3',
        aveCream: '#fff7e9',
        avePurple: '#6c3a9b',
        aveLilac: '#cfa7ff',
        aveYellow: '#ffd65c'
      },
      boxShadow: {
        bubble: '0 18px 50px rgba(232, 46, 121, 0.18)'
      },
      fontFamily: {
        display: ['Baloo 2', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
