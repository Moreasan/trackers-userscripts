import url from 'url'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import WebpackUserscript from 'webpack-userscript'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { DefinePlugin } from 'webpack'
import { UserScriptConfig } from './userscript.config'

const { scriptHeaders, scriptVersion, scriptHomePage, scriptFileName } = UserScriptConfig
const publicFolder = path.resolve(__dirname, '../public')
const outputPath = path.resolve(__dirname, '../dist')
const mode = process.env.NODE_ENV || 'development'
const isDev = mode === 'development'
const port = 8080

module.exports = {
  mode,
  devtool: false,
  target: 'web',
  entry: path.join(__dirname, '../src/index.ts'),
  output: {
    path: outputPath,
    filename: `${scriptFileName}.js`,
    publicPath: path.join(__dirname, '../public'),
  },
  watchOptions: {
    ignored: ['**/public', '**/node_modules', '**/dist'],
  },
  devServer: {
    port,
    hot: false,
    https: true,
    devMiddleware: {
      writeToDisk: true,
    },
    allowedHosts: "all",
    static: outputPath,
    client: false,
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: { comments: false },
          compress: !isDev
        }
      })
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '*.mjs']
  },
  experiments: {
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'sass-loader',
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.html$/,
        use: [
          'raw-loader',
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      VERSION: JSON.stringify(scriptVersion),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      BASE_PATH: JSON.stringify(isDev ? `https://localhost:${port}/` : scriptHomePage)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: outputPath,
          to: publicFolder,
          noErrorOnMissing: true
        }
      ]
    }),
    new WebpackUserscript({
      headers: scriptHeaders,
      proxyScript: {
        baseURL: url.pathToFileURL(outputPath).toString().replace('http', 'https')
      }
    })
  ]
}
