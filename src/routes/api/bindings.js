import express from 'express';

import {getBindings} from '../../controllers/BindingCardController';
import {UNAUTHORIZED_RESPONSE} from '../../lib/constants';

const router = express.Router();

router.get('/get',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  return getBindings(res.user.profile.id)
    .then(response => res.send({
      success: true,
      data: {
        items: response
      }
    }))
    .catch(err => res.send({
      success: false,
      error: err
    }));
});

router.get('/:id/edit',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  return getBindings(res.user.profile.id)
    .then(response => res.send({
      success: true,
      data: {
        items: response
      }
    }))
    .catch(err => res.send({
      success: false,
      error: err
    }));
});

export default router;
