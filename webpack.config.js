// module.exports = {
//   entry: ['./js/index.js', './js/card.js', './js/ribbon.js', './js/overview.js'],
//   output: {
//     filename: 'bundle.js'
//   }
// };

var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: ['./js/index.js', './js/card.js', './js/ribbon.js', './js/overview.js'],
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};