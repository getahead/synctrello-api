import express from 'express';

import verifyTrelloRequest from '../middleware/verifyTrelloRequest';

import {copyCardController, deleteCardController} from '../controllers/BindingCardController';
import {updateCardController} from '../controllers/UpdateCardController';

const router = express.Router();

const ACTION_TYPES = {
  copyCard: {
    name: 'copyCard',
    controller: copyCardController
  },
  updateCard: {
    name: 'updateCard',
    controller: updateCardController
  },
  deleteCard: {
    name: 'deleteCard',
    controller: deleteCardController
  }
};

router.post('/:member', verifyTrelloRequest);

router.all('/:member', (req, res, next) => {
  if (req.body && req.body.action && res.user.isLoggedIn) {
    const action = req.body.action.type;
    const controller = ACTION_TYPES[action] && ACTION_TYPES[action].controller;

    // console.log(action)
    console.log(req.body.action)
    // console.log(req.body.action.data)

    if (controller && typeof controller === 'function') {
      return controller(req, res, next)
        .then(response => res.sendStatus(200))
        .catch(err => res.sendStatus(200));
    }
  }

  return res.sendStatus(200);
});

export default router;
