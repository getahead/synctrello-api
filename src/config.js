import nconf from 'nconf';

nconf.env('__');
nconf.file('config.json');

nconf.defaults({
  appName: require('../package.json').name,
  appVersion: process.env.appVersion || require('../package.json').version,
  defaultLocale: 'en',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  locales: ['en', 'ru'],
  port: process.env.PORT || 8000,
  disableVerifying: false,
  userSecret: '',
});

export default nconf.get();
