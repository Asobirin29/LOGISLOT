import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getAvailableSlots } from '../controllers/slot.controller';

const router = Router();

router.use(requireAuth);

router.get('/available', getAvailableSlots);

export default router;
