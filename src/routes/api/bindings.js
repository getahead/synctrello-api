import express from 'express';
import mapOutput from '../../lib/mapOutput';

import {getBindings, editBinding} from '../../controllers/BindingCardController';
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

router.post('/:id/edit',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  if (!req.params.id) {
    return res.send({
      success: false,
      error: {
        message: 'No binding id provided'
      }
    });
  }

  return editBinding({
    userId: res.user.profile.id,
    id: req.params.id,
    newValues: req.body
  })
    .then(response => {
      return res.send({
        success: true,
        data: response
      })
    })
    .catch(err => res.send({
      success: false,
      error: err
    }));
});

export default router;
