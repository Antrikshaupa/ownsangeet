import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);

export default router;
