import express from 'express';
import * as defaulterController from '../controllers/defaulterController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get defaulter statistics
router.get('/statistics', defaulterController.getStatistics);

// Get all defaulters
router.get('/', defaulterController.getAll);

// Update defaulter status (admin only)
router.patch('/:id/status', requireRole('super_admin', 'union_admin'), defaulterController.updateStatus);

export default router;
