const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      path: './.development.env',
    }),
    new HtmlWebpackPlugin({
      title: 'Qbila',
      template: './public/index.html',
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
