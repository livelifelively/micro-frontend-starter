// const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new Dotenv({
      path: './.env.testing',
    }),
  ],
  // devServer: {
  //   contentBase: './src/micro-frontends/news/lib',
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
  // entry: './src/micro-frontends/news/src/index.js',
  // --entry src/micro-frontends/news/src/index.js --output-path src/micro-frontends/news/lib/
  output: {
    // path: absOutputPath,
    // publicPath: '/',
    filename: 'index.js',
    // library: 'CompaniesToTarget',
    libraryTarget: 'umd',
    // umdNamedDefine: true,
  },
};
