const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue'],
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'));
  },
};