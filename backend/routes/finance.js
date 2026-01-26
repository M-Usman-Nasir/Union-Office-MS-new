import express from 'express';
import * as financeController from '../controllers/financeController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get finance summary
router.get('/summary', financeController.getSummary);

// Get all finance records
router.get('/', financeController.getAll);

// Get finance by ID
router.get('/:id', financeController.getById);

// Create finance record (admin only)
router.post('/', requireRole('super_admin', 'union_admin'), financeController.create);

// Update finance record (admin only)
router.put('/:id', requireRole('super_admin', 'union_admin'), financeController.update);

// Delete finance record (admin only)
router.delete('/:id', requireRole('super_admin', 'union_admin'), financeController.remove);

export default router;
