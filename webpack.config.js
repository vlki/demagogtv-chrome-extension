const path = require('path');

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const outputDir = process.env.NODE_ENV === 'development' ? 'dev' : 'build';

module.exports = {
  entry: {
    'content-script': './src/contentScript.js',
    background: './src/background.js'
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: '[name].js'
  },
  plugins: [
    process.env.NODE_ENV === 'development' ?
      new ChromeExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: 'content-script',
          background: 'background'
        }
      }) : null,

    new CopyWebpackPlugin([{
      from: './public'
    }])
  ]
};
