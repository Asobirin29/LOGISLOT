import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { 
  getUsers, createUser, updateUser, toggleUserStatus,
  getDocks, createDock, updateDock, toggleDockStatus,
  getTimeSlots, createTimeSlot, updateTimeSlot,
  getAuditLogs, getSystemHealth
} from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole(['admin']));

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);

// Loading Docks
router.get('/loading-docks', getDocks);
router.post('/loading-docks', createDock);
router.put('/loading-docks/:id', updateDock);
router.patch('/loading-docks/:id/toggle-status', toggleDockStatus);

// Time Slots
router.get('/time-slots', getTimeSlots);
router.post('/time-slots', createTimeSlot);
router.put('/time-slots/:id', updateTimeSlot);

// Audit Logs & Health
router.get('/audit-logs', getAuditLogs);
router.get('/system-health', getSystemHealth);

export default router;
