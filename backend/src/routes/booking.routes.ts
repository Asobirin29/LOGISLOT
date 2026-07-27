import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '@prisma/client';
import { createBooking, getMyBookings, rescheduleBooking, cancelBooking, getAllBookings } from '../controllers/booking.controller';

const router = Router();

router.use(requireAuth);

// Supplier-specific routes
router.post('/', requireRole([Role.supplier]), createBooking);
router.get('/my', requireRole([Role.supplier]), getMyBookings);
router.patch('/:id', requireRole([Role.supplier]), rescheduleBooking);
router.delete('/:id', requireRole([Role.supplier]), cancelBooking);

// Admin/IC can view all bookings
router.get('/', requireRole([Role.admin, Role.ic, Role.warehouse, Role.security]), getAllBookings);

export default router;
