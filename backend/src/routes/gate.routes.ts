import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '@prisma/client';
import { scanQR, manualCheckin, getTodayQueue } from '../controllers/gate.controller';

const router = Router();

// Rate limit: 30 requests/minute per IP for scan endpoint
const scanRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan scan. Coba lagi dalam 1 menit.'
  }
});

router.use(requireAuth);

// Security and admin can operate gate
router.post('/scan', scanRateLimit, requireRole([Role.security, Role.admin]), scanQR);
router.post('/manual-checkin', requireRole([Role.security, Role.admin]), manualCheckin);
router.get('/queue', requireRole([Role.security, Role.admin, Role.ic, Role.warehouse]), getTodayQueue);

export default router;
