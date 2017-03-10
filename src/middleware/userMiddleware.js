import config from '../config';
import jwt from 'jsonwebtoken';
import * as userController from '../controllers/UserController';

export default function userMiddleware(req, res, next) {
  const token = req.token;
  res.user = {
    isLoggedIn: false,
    profile: {},
    trelloToken: ''
  };

  if (!token) {
    return next();
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.userSecret);
  }
  catch(e) {
    return next();
  }

  if (!decoded) {
    return next();
  }

  return userController.authorizeUserByLocalToken(decoded.id)
    .then(result => {
      if (!result) {
        return Promise.reject(result);
      }
      res.user = {
        isLoggedIn: true,
        profile: result.profile,
        trelloToken: result.trelloToken,
        trelloId: result.trelloId
      };

      return next();
    })
    .catch(err => {
      res.user = {
        isLoggedIn: false,
        profile: {},
        trelloToken: ''
      };

      next();
    });
}
