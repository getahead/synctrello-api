import express from 'express';
import bearerToken from 'express-bearer-token';
import auth from './auth';
import boards from './boards';
import bindings from './bindings';
import cards from './cards';
import userMiddleware from '../../middleware/userMiddleware';

const router = express.Router();

router.use(bearerToken());
router.use(userMiddleware);
router.use('/auth', auth);
router.use('/boards', boards);
router.use('/bindings', bindings);
router.use('/cards', cards);


export default router;
