'use strict'

const path = require('path');
module.exports = {
  entry:'./src/index.ts',
  output:{
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode:'production'
}
