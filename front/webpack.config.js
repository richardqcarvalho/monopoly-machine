const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js'],
  },
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public/favicon.ico', to: 'favicon.ico' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/i,
        exclude: /node_modules/,
        use: ['svg-react-loader'],
      },
    ],
  },
}
