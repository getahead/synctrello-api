import URI from 'urijs';
import crypto from 'crypto';
import config from '../config';
import {notFoundController} from '../controllers/CommonController';

const verifyTrelloWebhookRequest = (request, secret, callbackURL) => {
  const base64Digest = (s) =>
    crypto.createHmac('sha1', secret).update(s).digest('base64');

  const content = request.body + callbackURL;
  const doubleHash = base64Digest(base64Digest(content));
  const headerHash = base64Digest(request.headers['x-trello-webhook'] || '');

  return doubleHash == headerHash;
};

export default function (req, res, next) {
  if (req.method === 'POST') {
    const callbackURL = URI(req.origin).pathname(req.originalUrl).toString();
    const verifyResult = verifyTrelloWebhookRequest(req, config.TRELLO_SECRET, callbackURL);

    if (!verifyResult && !config.disableVerifying) {
      return notFoundController(req, res);
    }
  }

  return next();
}
