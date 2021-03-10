// const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  plugins: [
    new Dotenv({
      path: './.env.production',
    }),
  ],
  // devServer: {
  //   contentBase: './dist',
  // },
  externals: {
    // Don't bundle these packages
    react: 'react',
    'react-dom': 'react-dom',
    // '@ant-design/icons': '@ant-design/icons',
    antd: 'antd',
    moment: 'moment',
    lodash: 'lodash',
    'prop-types': 'prop-types',
    // '@qbila/ui-services': '@qbila/ui-services',
  },
  // build the aggregated component only.
  // entry: './src/app.js',
  output: {
    // path: path.resolve(__dirname, '../', 'dist'),
    // publicPath: '/',
    filename: 'index.js',
    // library: 'CompaniesToTarget',
    libraryTarget: 'umd',
    // umdNamedDefine: true,
  },
};
