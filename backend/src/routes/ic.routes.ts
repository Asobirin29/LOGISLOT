import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '@prisma/client';
import { getAllBookings, updateBookingPriority } from '../controllers/ic.controller';

const router = Router();

router.use(requireAuth);

// GET all bookings (IC, Admin, Warehouse, Security)
router.get(
  '/',
  requireRole([Role.ic, Role.admin, Role.warehouse, Role.security]),
  getAllBookings
);

// PATCH priority (IC and Admin only)
router.patch(
  '/:id/priority',
  requireRole([Role.ic, Role.admin]),
  updateBookingPriority
);

export default router;
