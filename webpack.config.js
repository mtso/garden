const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const indexInjector = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './app/index.template',
  inject: 'body',
});

module.exports = {
  entry: './app/index',
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader?presets[]=react'],
      },
    ],
  },
  plugins: [
    indexInjector,
  ],
}
