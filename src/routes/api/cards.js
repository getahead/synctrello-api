import express from 'express';

import {getCards, searchCards} from '../../controllers/CardsController';
import {getBindings} from '../../controllers/BindingCardController';
import {UNAUTHORIZED_RESPONSE} from '../../lib/constants';

const router = express.Router();

router.get('/get',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  return getBindings(res.user.profile.id)
    .then(bindings => bindings.reduce((result, binding) => result.concat(binding.idCard), []))
    .then(ids => getCards(ids, res.user.trelloToken))
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
router.get('/search', (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  const {query, idBoards = ''} = req.query;
  if (!query) {
    return res.send({
      success: true,
      data: {
        items: []
      }
    });
  }

  return searchCards({query, idBoards, trelloToken: res.user.trelloToken})
    .then(response => res.send(response))
    .catch(err => res.send({
      success: false,
      error: err
    }));
});

router.get('/:id',  (req, res) => {
  if (!res.user.isLoggedIn) {
    return res.send(UNAUTHORIZED_RESPONSE);
  }

  if (!req.params.id) {
    return res.send({success: false});
  }

  return getCards([req.params.id], res.user.trelloToken)
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


export default router;
