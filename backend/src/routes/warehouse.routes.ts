import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '@prisma/client';
import {
  getArrivedQueue,
  getDockStatus,
  assignDock,
  startUnloading,
  completeUnloading,
  updateDockStatus
} from '../controllers/warehouse.controller';

const router = Router();
router.use(requireAuth);

const warehouseRoles = [Role.warehouse, Role.admin];
const allOpsRoles = [Role.warehouse, Role.admin, Role.ic];

// Queue and dock visibility
router.get('/queue', requireRole(allOpsRoles), getArrivedQueue);
router.get('/docks/status', requireRole(allOpsRoles), getDockStatus);

// Warehouse operations (warehouse + admin)
router.patch('/bookings/:id/assign-dock', requireRole(warehouseRoles), assignDock);
router.patch('/bookings/:id/start-unloading', requireRole(warehouseRoles), startUnloading);
router.patch('/bookings/:id/complete', requireRole(warehouseRoles), completeUnloading);

// Dock maintenance toggle (warehouse + admin)
router.patch('/docks/:id/status', requireRole(warehouseRoles), updateDockStatus);

export default router;
