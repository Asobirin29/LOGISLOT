import { Router } from 'express';
import { getLoadingDocks, getTimeSlots } from '../controllers/master.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Requires any valid authenticated user to access master data
router.use(requireAuth);

router.get('/docks', getLoadingDocks);
router.get('/timeslots', getTimeSlots);

export default router;
