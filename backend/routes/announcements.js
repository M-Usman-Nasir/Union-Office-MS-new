import express from 'express';
import * as announcementController from '../controllers/announcementController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all announcements
router.get('/', announcementController.getAll);

// Get announcement by ID
router.get('/:id', announcementController.getById);

// Create announcement (admin only)
router.post(
  '/',
  requireRole('super_admin', 'union_admin'),
  requirePermission('announcement.create'),
  announcementController.create
);

// Update announcement (admin only)
router.put(
  '/:id',
  requireRole('super_admin', 'union_admin'),
  requirePermission('announcement.update'),
  announcementController.update
);

// Delete announcement (admin only)
router.delete(
  '/:id',
  requireRole('super_admin', 'union_admin'),
  requirePermission('announcement.delete'),
  announcementController.remove
);

export default router;
