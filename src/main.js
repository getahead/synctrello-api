import express from 'express';
import bodyParser from 'body-parser';

import config from './config';
import errorHandler from './lib/errorHandler';
import serverUrlMiddleware from './middleware/originUrlMiddleware';
import slashesMiddleware from './middleware/slashes';
import checkUriMiddleware from './middleware/checkUri';
import modifyResponse from './middleware/modifyResponse';
import Raven from 'raven'
import mongoose from './lib/mongoose';


import routes from './routes';

const app = express();

app.disable('x-powered-by');
app.enable('strict routing');
app.set('trust proxy', true);

if (config.isProduction) {
  Raven.config(config.SENTRY_DSN).install();
  app.use(Raven.requestHandler());
}

app.use(slashesMiddleware);
app.use(checkUriMiddleware);

app.use(serverUrlMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(modifyResponse);
app.use(routes);

if (config.isProduction) {
  app.use(Raven.errorHandler());
}
app.use(errorHandler);

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
