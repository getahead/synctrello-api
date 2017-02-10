import express from 'express';

import verifyTrelloRequest from '../middleware/verifyTrelloRequest';

import {copyCardController} from '../controllers/CopyCardController';
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
  }
};

router.post('/:member', verifyTrelloRequest);

router.all('/:member', (req, res, next) => {
  if (req.body && req.body.action && res.user.isLoggedIn) {
    const action = req.body.action.type;
    const controller = ACTION_TYPES[action] && ACTION_TYPES[action].controller;

    // console.log(action)
    // console.log(req.body)
    // console.log(req.body.action.data)

    if (controller && typeof controller === 'function') {
      controller(req, res, next);
    }
  }

  res.status(200).send();
});

export default router;
