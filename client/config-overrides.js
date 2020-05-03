/* config-overrides.js */

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.js',
    template: 'public/index.html',
    outPath: '/production.html'
  }
]);

module.exports = {
  webpack: function(config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  }
};
