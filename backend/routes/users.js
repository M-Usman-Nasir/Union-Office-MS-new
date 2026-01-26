import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (super admin only)
router.get('/', requireRole('super_admin'), userController.getAll);

// Get user by ID
router.get('/:id', requireRole('super_admin', 'union_admin'), userController.getById);

// Update user (super admin only)
router.put('/:id', requireRole('super_admin'), userController.update);

// Update user password (super admin only)
router.patch('/:id/password', requireRole('super_admin'), userController.updatePassword);

// Delete user (super admin only)
router.delete('/:id', requireRole('super_admin'), userController.remove);

export default router;
