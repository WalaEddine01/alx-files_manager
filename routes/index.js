import { Router } from 'express';
import { stats, status } from '../controllers/AppController';
import postNew from '../controllers/UsersController';

const router = Router();
router.get('/status', status);

router.get('/stats', stats);

router.post("/users", postNew);
export default router;
