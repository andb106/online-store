// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  devtool: isProduction ? undefined : 'source-map',
  devServer: {
    open: true,
    host: 'localhost',
    hot: false,
    static: path.resolve(__dirname, 'dist'),
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, 'src', 'favicon.ico'),
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new EslintPlugin({ extensions: 'ts' }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },

  experiments: {
    topLevelAwait: true,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      })
    );
  } else {
    config.mode = 'development';
  }
  return config;
};
