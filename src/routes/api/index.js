import express from 'express';
import bearerToken from 'express-bearer-token';
import auth from './auth';
import boards from './boards';
import userMiddleware from '../../middleware/userMiddleware';

const router = express.Router();

router.use(bearerToken());
router.use(userMiddleware);
router.use('/auth', auth);
router.use('/boards', boards);


export default router;
