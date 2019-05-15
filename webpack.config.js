const path = require('path');
const webpack = require('webpack');

const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function getEnvironments(MODE) {
  let pkgJson = require(path.join(__dirname, 'package.json'));
  let envJson = require(path.join(__dirname, '.env.json'));

  let env = {};
  Object.assign(env, envJson.common, MODE === 'development' ? envJson.development : envJson.production);
  for (var key in env) env[key] = typeof env[key] == 'string' ? JSON.stringify(env[key]) : env[key];

  const result = {
    APP_BUNDLE: JSON.stringify(pkgJson.name),
    APP_VERSION: JSON.stringify(pkgJson.version),
    APP_NAME: JSON.stringify(pkgJson.displayName),
    ...env
  };

  return result;
};

module.exports = env => {

  const DEV_SERVER = process.argv.indexOf('--inline') >= 0 && process.argv.indexOf('--hot') >= 0;
  const MODE = env && (typeof env.release !== 'undefined' || typeof env.prodaction !== 'undefined') ? 'production' : 'development';
  const DEV = MODE == 'development';
  const PROD = !DEV;
  const CONFIG = getEnvironments(MODE);
  const PORT = 8081;

  let config = {
    entry: path.join(__dirname, 'src/app.js'),
    mode: MODE,

    resolve: {
      extensions: ['.js', '.json', '.vue'],
      modules: [path.join(__dirname, 'src'), 'node_modules'],
    },

    output: {
      path: __dirname + '/www',
      filename: 'app.js'
    },

    plugins: [
      new webpack.DefinePlugin({
        MODE: JSON.stringify(MODE),
        DEV: DEV,
        PROD: PROD,
        ...CONFIG,
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.ejs',
        inject: true,
        title: JSON.parse(CONFIG.APP_NAME),
        minify: {
          removeComments: PROD,
          removeScriptTypeAttributes: true,
          removeAttributeQuotes: PROD,
          useShortDoctype: true,
          decodeEntities: true,
          collapseWhitespace: PROD,
          minifyCSS: PROD,
        }
      }),
      new VueLoaderPlugin()
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules(\/|\\)(?!(framework7|framework7-vue|template7|dom7)(\/|\\)).*/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              plugins: ['transform-runtime', 'transform-object-rest-spread']
            }
          }
        },
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'file-loader',
          options: {name: 'img/[name].[ext]?[hash]'}
        },
        {
          test: /\.(woff2?|eot|ttf|otf|mp3|wav)$/,
          loader: 'file-loader',
          options: {name: 'font/[name].[ext]?[hash]'}
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.less$/,
          loader: ['vue-style-loader', 'css-loader', 'less-loader']
        },
      ]
    }
  };

  if (PROD) {
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(new UglifyJsWebpackPlugin());
  } else if (DEV_SERVER) {
    config.output.publicPath = '/';
    config.devtool = 'eval';
    config.devServer = {
      contentBase: path.join(__dirname, 'www'),
      port: PORT,
      stats: { colors: true },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 100,
        ignored: /node_modules|platforms/,
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
  }

  return config;
};
