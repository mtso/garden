const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const indexInjector = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './app/index.template.html',
  inject: 'body',
});

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  disable: false,
  allChunks: true,
})

module.exports = {
  entry: [
    path.resolve(__dirname, 'app/index'),
    path.resolve(__dirname, 'app/style/main.scss'),
  ],
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
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
        loader: ['babel-loader?presets[]=react,presets[]=es2015'],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        })
      }
    ],
  },
  plugins: [
    indexInjector,
    extractSass,
  ],
}
