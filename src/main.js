import express from 'express';
import bodyParser from 'body-parser';

import config from './config';
import errorHandler from './lib/errorHandler';
import serverUrlMiddleware from './middleware/originUrlMiddleware';
import slashesMiddleware from './middleware/slashes';
import checkUriMiddleware from './middleware/checkUri';
import verifyTrelloRequest from './middleware/verifyTrelloRequest';
import mongoose from './lib/mongoose';


import routes from './routes';

const app = express();
app.disable('x-powered-by');
app.enable('strict routing');

app.use(slashesMiddleware);
app.use(checkUriMiddleware);

app.use(serverUrlMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(verifyTrelloRequest);
app.use(routes);
app.get('*', errorHandler);

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
