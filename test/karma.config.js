// Karma configuration
// Generated on Thu Sep 28 2017 10:40:06 GMT+0800 (中国标准时间)
var webpack = require('webpack')
var path = require('path')

var webpackConfig = {
  mode: 'development',
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../', 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devtool: '#inline-source-map'
}

module.exports = function(config) {
  config.set({
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: './polyfills.js', watched: false },
      { pattern: './test_index.js', watched: false },      
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './polyfills.js': ['webpack'],
      './test_index.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome','Firefox','IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  })
}
