import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All settings routes require authentication
router.use(authenticate);

// Get settings
// - READ access is allowed for all authenticated roles (resident, staff, union_admin, super_admin)
// - Used by both admin (Settings page) and residents (visibility checks)
router.get('/:societyId', settingsController.getSettings);

// Update settings (admin only)
router.put('/:societyId', requireRole(['union_admin', 'super_admin']), settingsController.updateSettings);

// Get maintenance configuration
// - READ access allowed to all authenticated users so UIs can calculate/understand dues if needed
router.get('/:societyId/maintenance-config', settingsController.getMaintenanceConfig);

// Update maintenance configuration (admin only)
router.put('/:societyId/maintenance-config', requireRole(['union_admin', 'super_admin']), settingsController.updateMaintenanceConfig);

export default router;
