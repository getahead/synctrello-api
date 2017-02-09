const Bluebird = require('bluebird');

Bluebird.config({ warnings: false });
require('babel-runtime/core-js/promise').default = Bluebird;

module.exports = Bluebird;
