import express from 'express';
import * as complaintController from '../controllers/complaintController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all complaints
router.get('/', complaintController.getAll);

// Get complaint by ID
router.get('/:id', complaintController.getById);

// Create complaint (any authenticated user)
router.post('/', complaintController.create);

// Update complaint
router.put('/:id', complaintController.update);

// Update complaint status (admin only)
router.patch('/:id/status', requireRole('super_admin', 'union_admin'), complaintController.updateStatus);

// Assign staff to complaint (admin only)
router.patch('/:id/assign', requireRole(['super_admin', 'union_admin']), complaintController.assignStaff);

// Add progress update (admin/staff)
router.post('/:id/progress', requireRole(['super_admin', 'union_admin', 'staff']), complaintController.addProgress);

// Get progress history
router.get('/:id/progress', complaintController.getProgress);

// Delete complaint
router.delete('/:id', complaintController.remove);

export default router;
