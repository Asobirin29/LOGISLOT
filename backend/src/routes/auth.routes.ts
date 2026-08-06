import { Router } from 'express';
import { register, login, refresh, logout, updateProfile } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.put('/profile', requireAuth, updateProfile);

export default router;

