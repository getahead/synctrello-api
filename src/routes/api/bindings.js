import express from 'express';

import {getBindings, editBinding, createBinding, deleteBinding} from '../../controllers/BindingCardController';
import {UNAUTHORIZED_RESPONSE, REQUIRED_PARAMS} from '../../lib/constants';

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

router.get('/:id/delete',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  if (!req.params.id) {
    return res.send(REQUIRED_PARAMS);
  }

  return deleteBinding({userId: res.user.profile.id, id: req.params.id})
    .then(response => {
      return res.send({
        success: true,
        data: {
          items: response
        }
      })
    })
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
    return res.send(REQUIRED_PARAMS);
  }

  if ((req.body.idCard && req.body.idBindedCard)
    && req.body.idCard === req.body.idBindedCard) {
    return res.status(400).send({
      success: false,
      error: {
        message: 'Selected cards are same'
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

router.post('/create', (req, res, next) => {
  const {firstCardId, secondCardId} = req.body;

  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  if (!firstCardId || !secondCardId || firstCardId === secondCardId) {
    return res.status(400).send({
      success: false,
      error: {
        message: firstCardId && secondCardId && firstCardId === secondCardId
          ? 'Selected cards are same'
          : 'Provide 2 cards for the binding'
      }
    });
  }

  return createBinding({firstCardId, secondCardId, user: res.user}).then(result => {
    res.send({
      success: true,
      data: {
        items: result
      }
    });
  })
    .catch(error => next(error));
});

export default router;
