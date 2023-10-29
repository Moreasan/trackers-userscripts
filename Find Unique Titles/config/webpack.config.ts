import { UserScriptConfig } from "./userscript.config";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import url from "url";
import * as webpack from "webpack";
import "webpack-dev-server";
import WebpackUserscript from "webpack-userscript";

const { scriptHeaders, scriptVersion, scriptHomePage, scriptFileName } =
  UserScriptConfig;
const publicFolder = path.resolve(__dirname, "../public");
const outputPath = path.resolve(__dirname, "../dist");
const mode =
  (process.env.NODE_ENV as "development" | "production") || "development";
const isDev = mode === "development";
const port = 8080;

const config: webpack.Configuration = {
  mode,
  devtool: false,
  target: "web",
  entry: path.join(__dirname, "../src/index.ts"),
  output: {
    path: outputPath,
    filename: `${scriptFileName}.js`,
    publicPath: path.join(__dirname, "../public"),
  },
  watchOptions: {
    ignored: ["**/public", "**/node_modules", "**/dist"],
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
    minimize: true,
    usedExports: true,
    sideEffects: true,
    innerGraph: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            dead_code: true,
            conditionals: false, // don't optimize conditionals
            booleans: false, // don't optimize booleans
            if_return: false, // don't optimize if-s followed by return/continue
            join_vars: false, // don't join var declarations
            collapse_vars: false, // don't collapse vars
            reduce_vars: false, // don't try to optimize/collapse specific variable values
            sequences: false, // don't join consecutive simple statements using commas
          },
          mangle: false, // don't alter variable/function names
          keep_classnames: true,
          keep_fnames: true,
          output: {
            beautify: true, // maintain original formatting
            comments: false, // remove comments
            indent_level: 2, // maintain an indentation level of 2 spaces
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: [".ts", ".js", "*.mjs"],
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["sass-loader", "style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(scriptVersion),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      BASE_PATH: JSON.stringify(
        isDev ? `https://localhost:${port}/` : scriptHomePage
      ),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: outputPath,
          to: publicFolder,
          noErrorOnMissing: true,
        },
      ],
    }),
    new WebpackUserscript({
      headers: scriptHeaders,
      proxyScript: {
        baseURL: url
          .pathToFileURL(outputPath)
          .toString()
          .replace("http", "https"),
      },
    }),
  ],
};

export default config;
