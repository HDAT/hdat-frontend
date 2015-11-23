var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    app: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      './src/entry.jsx'
    ],
    vendor: [
      'react',
      'immutable',
      'superagent'
    ]
  },
  output: {
    path: './build',
    publicPath: 'http://localhost:8080/',
    filename: "bundle.js"
  },
  devtool: 'eval-source-map',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loaders: ['react-hot', 'babel?experimental'], exclude: /node_modules/},
      { test: /\.json$/, loader: 'json' },
      { test: /\.yml$/, loader: 'json!yaml' },
      { test: /\.scss$/, loader: 'style!css!autoprefixer!sass' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;