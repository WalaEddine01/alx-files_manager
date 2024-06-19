import { Router, application } from 'express';
import { stats, status } from '../controllers/AppController';
import postNew from '../controllers/UsersController';

const router = Router();
router.get('/status', status);

router.get('/stats', stats);

router.post('/users', postNew);

router.get('/connect', getConnect);

router.get('disconnect', getDisconnect);

router.get('/users/me', getMe);

export default router;
