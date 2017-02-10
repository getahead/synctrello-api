import URI from 'urijs';
import crypto from 'crypto';
import config from '../config';
import {authorizeUserByLocalToken} from '../controllers/UserController';
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
  if (req.params.member && req.method === 'POST') {
    const callbackURL = URI(req.origin).pathname(req.originalUrl).toString();
    const verifyResult = verifyTrelloWebhookRequest(req, config.TRELLO_SECRET, callbackURL);

    if (!verifyResult && !config.disableVerifying) {
      return notFoundController(req, res);
    }

    return authorizeUserByLocalToken(req.params.member)
      .then(result => {
        res.user = {
          isLoggedIn: true,
          profile: result.profile,
          trelloToken: result.trelloToken
        };

        return next();
      })
      .catch(err => notFoundController(req, res));
  } else {
    return next();
  }
}
