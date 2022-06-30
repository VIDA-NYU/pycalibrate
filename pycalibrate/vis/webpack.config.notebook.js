const config = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'calibration.js',
    library: 'calibration'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude:  /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader",
        options: {
          limit: Infinity // everything
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devServer:{
    hot:false,
  },
  mode: 'production'
};


module.exports = config;
