// craco.config.js
const path = require('path');
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    devServer: {
      host:'0.0.0.0',
      compress: true,
      port: 9000,
    },
  }