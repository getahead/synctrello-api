import express from 'express';
import webhooks from './webhooks';

import {notFoundController} from '../controllers/CommonController';

const router = express.Router();

router.use('/webhooks', webhooks);

router.all('*', notFoundController);

export default router;
