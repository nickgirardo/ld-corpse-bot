module.exports = {
  entry: './src/app.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.frag$/,
        loader: 'raw-loader',
      },
      {
        test: /\.vert$/,
        loader: 'raw-loader',
      },
      {
        test: /\.png$/,
        loader: 'base64-inline-loader?name=[name].[ext]',
      },
    ],
  },
}
