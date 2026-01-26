import express from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all maintenance records
router.get('/', maintenanceController.getAll);

// Get maintenance by ID
router.get('/:id', maintenanceController.getById);

// Create maintenance record (admin only)
router.post('/', requireRole('super_admin', 'union_admin'), maintenanceController.create);

// Update maintenance record (admin only)
router.put('/:id', requireRole('super_admin', 'union_admin'), maintenanceController.update);

// Record payment
router.post('/:id/payment', requireRole('super_admin', 'union_admin'), maintenanceController.recordPayment);

// Delete maintenance record (admin only)
router.delete('/:id', requireRole('super_admin', 'union_admin'), maintenanceController.remove);

export default router;
