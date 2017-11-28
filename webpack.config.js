const webpack = require('webpack');

module.exports = {
  entry: './reactApp/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'FACEBOOK_APP_ID': JSON.stringify(process.env.FACEBOOK_APP_ID) 
      } 
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015']
          }
        } 
      }, 
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
