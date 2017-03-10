import express from 'express';
import config from '../../config';
import URI from 'urijs';

import * as userController from '../../controllers/UserController';
import {UNAUTHORIZED_RESPONSE} from '../../lib/constants';

const router = express.Router();

router.get('/trello', (req, res) => {
  return res.json({
    success: true,
    data: {
      url: URI(config.API_URL).pathname('/1/authorize/')
        .query({
          key: config.TRELLO_API_KEY,
          expiration: 'never',
          name: 'Sync Trello',
          response_type: 'token',
          return_url: `${req.query.origin || config.frontUrl}/action/social-login/finish/`,
          callback_method: `postMessage`,
          scope: ['account', 'read', 'write'].join(',')
        })
        .toString()
    }
  });
});

router.get('/user', (req, res) => {
  if (!req.query.token) {
    return res.send(res.user.isLoggedIn
      ? {
          success: true,
          data: {
            profile: res.user.profile
          }
        }
      : UNAUTHORIZED_RESPONSE
    );
  }

  return userController.loginWithTrello(req.query.token)
    .then(result => {
      if (!result) {
        return Promise.reject(result);
      }
      return res.send({
        success: true,
        data: {
          profile: result.profile,
          token: result.token
        }
      })
    })
    .catch(err => res.send({
      ...UNAUTHORIZED_RESPONSE,
      error: {
        ...UNAUTHORIZED_RESPONSE.error,
        ...err
      }
    }))
});

export default router;
