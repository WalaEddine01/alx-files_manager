import { Router } from 'express';
import { stats, status } from '../controllers/AppController';
import postNew from '../controllers/UsersController';
import getConnect from '../controllers/AuthController';

const router = Router();
router.get('/status', status);

router.get('/stats', stats);

router.post('/users', postNew);

router.post('/connect', getConnect);

export default router;
