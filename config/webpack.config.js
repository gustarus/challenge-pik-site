const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const variables = require(path.join(__dirname, 'template.config.js'));

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    app: [path.join(__dirname, '..', 'app', 'index.js')]
  },

  resolve: {
    extensions: ['.mjs', '.js', '.svelte']
  },

  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[id].[hash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jade$/,
        use: 'jade-loader',
      },
    ]
  },

  mode,

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),

    new HtmlPlugin({
      title: variables.title,
      description: variables.description,
      filename: path.join('index.html'),
      template: path.join('app', 'index.jade'),
    }),
  ],

  devtool: prod ? false : 'source-map'
};
