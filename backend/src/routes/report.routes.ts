import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '@prisma/client';
import { getSlaReport } from '../controllers/report.controller';

const router = Router();

router.use(requireAuth);

// SLA report (IC and Admin only)
router.get('/sla', requireRole([Role.ic, Role.admin]), getSlaReport);

export default router;
