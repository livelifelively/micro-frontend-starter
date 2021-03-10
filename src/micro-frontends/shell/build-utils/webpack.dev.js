const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
  ],
  devServer: {
    contentBase: './dist',
  },
  externals: {
    // Don't bundle these packages
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
    '@ant-design/icons': '@ant-design/icons',
    antd: 'antd',
    moment: 'moment',
    lodash: 'lodash',
    'prop-types': 'prop-types',
    '@qbila/ui-services': '@qbila/ui-services',
  },
  // build the aggregated component only.
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    publicPath: '/',
    filename: 'index.js',
    library: 'CompaniesToTarget',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
