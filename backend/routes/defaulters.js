import express from 'express';
import * as defaulterController from '../controllers/defaulterController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get defaulter statistics
router.get('/statistics', defaulterController.getStatistics);

// Get previous-year defaulters summary (admin only)
router.get('/previous-years', requireRole('super_admin', 'union_admin'), defaulterController.getPreviousYearDefaulters);

// Export previous-year defaulters as CSV (admin only)
router.get('/previous-years/export', requireRole('super_admin', 'union_admin'), defaulterController.exportPreviousYearDefaultersCsv);

// Export defaulters as CSV (admin only)
router.get('/export', requireRole('super_admin', 'union_admin'), defaulterController.exportDefaulters);

// Get all defaulters
router.get('/', defaulterController.getAll);

// Sync defaulters from maintenance (admin only) - must be before /:id
router.post('/sync', requireRole('super_admin', 'union_admin'), defaulterController.syncFromMaintenance);

// Update defaulter status (admin only)
router.patch('/:id/status', requireRole('super_admin', 'union_admin'), defaulterController.updateStatus);

export default router;
