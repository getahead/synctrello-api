import nconf from 'nconf';

nconf.env('__');
nconf.file('config.json');

nconf.defaults({
  appName: require('../package.json').name,
  appVersion: process.env.appVersion || require('../package.json').version,
  defaultLocale: 'en',
  isProduction: process.env.NODE_ENV === 'production',
  locales: ['en', 'ru'],
  port: process.env.PORT || 8000,
  remoteHotReload: false,
  sentryUrl: '',
  userSecret: '',
});

export default nconf.get();
