require('babel-register');
require('babel-polyfill');

global.Promise = require('./configureBluebird');
require('./main');
