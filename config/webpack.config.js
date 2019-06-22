const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const svelteGlobalCSS = require('svelte-preprocess-css-global');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const variables = require(path.join(__dirname, 'template.config.js'));

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const publicPath = path.join(__dirname, '..', 'public');

module.exports = {
  mode,

  devtool: prod ? 'cheap-module-source-map' : 'source-map',

  entry: {
    app: [path.join(__dirname, '..', 'app', 'index.js')]
  },

  resolve: {
    extensions: ['.mjs', '.js', '.svelte'],
    alias: {
      '@app': path.resolve(__dirname, '..', 'app'),
    },
  },

  output: {
    path: publicPath,
    filename: `[name]${prod && '.[hash]'}.js`,
    chunkFilename: `[name].[id]${prod && '.[hash]'}.js`,
    publicPath: '/',
  },

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
            preprocess: {
              style: svelteGlobalCSS()
            }
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

  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].${prod && '[hash]'}.css`
    }),

    new HtmlPlugin({
      title: variables.title,
      description: variables.description,
      filename: path.join('index.html'),
      template: path.join('app', 'index.jade'),
    }),

    new CopyPlugin([
      { from: path.join(__dirname, '..', 'app', 'manifest.json'), to: path.join(publicPath, 'manifest.json') },
      { from: path.join(__dirname, '..', 'app', 'service-worker.js'), to: path.join(publicPath, 'service-worker.js') },
      { from: path.join(__dirname, '..', 'app', 'images', 'icons', 'logo-192.png'), to: path.join(publicPath, 'logo-192.png') },
      { from: path.join(__dirname, '..', 'app', 'images', 'icons', 'logo-512.png'), to: path.join(publicPath, 'logo-512.png') },
    ]),
  ],
};
