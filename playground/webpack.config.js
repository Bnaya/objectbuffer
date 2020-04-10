/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require("html-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = {
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".ts"],
  },
  module: {
    rules: [
      {
        test: [/\.m?js$/, /\.ts$/],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
