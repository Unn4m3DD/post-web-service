const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: 'node',
  entry: "./src/backend/index.ts",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'backend.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: {
    'express': 'commonjs express'
  }
};