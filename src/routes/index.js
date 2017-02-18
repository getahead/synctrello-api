import express from 'express';
import webhooks from './webhooks';
import api from './api';

import {notFoundController} from '../controllers/CommonController';

const router = express.Router();

router.use('/api/v1', api);
router.use('/webhooks', webhooks);

router.get('/favicon.ico', function(req, res) {
  res.sendStatus(204);
});
router.get('/trigger500', (req, res, next) => {
  throw new Error();
});
router.all('*', notFoundController);

export default router;
