const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      teal: colors.teal,
      red: colors.red,
      yellow: colors.amber,
      white: {
          DEFAULT: '#ffffff',
      },
      green: {
          light: '#6fcf97',
          DEFAULT: '#27AE60',
          dark: '#219653',
          darker: '#1e874b',
      },
      red: {
          light: '#FF7F7F',
          DEFAULT: '#EB5757',
          dark: '#C20D0D',
      },
      blue: {
        light: '#48B4F2',
        DEFAULT: '#131EEF',
        dark: '#090E6B',
      },
      orange: {
          light: '#FFEBDA',
          DEFAULT: '#F66A0A',
          dark: '#A04100',
      },
      primary: {
          DEFAULT: '#24292E',
      },
      warning: {
          DEFAULT: '#D1711C',
      }
  },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
