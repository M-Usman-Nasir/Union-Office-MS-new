import express from 'express';
import * as residentController from '../controllers/residentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all residents
router.get('/', residentController.getAll);

// Get resident by ID
router.get('/:id', residentController.getById);

// Create resident (admin only)
router.post('/', requireRole('super_admin', 'union_admin'), residentController.create);

// Update resident (admin only)
router.put('/:id', requireRole('super_admin', 'union_admin'), residentController.update);

// Delete resident (admin only)
router.delete('/:id', requireRole('super_admin', 'union_admin'), residentController.remove);

export default router;
