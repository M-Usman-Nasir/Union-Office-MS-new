import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (super admin and union admin)
router.get('/', requireRole('super_admin', 'union_admin'), userController.getAll);

// Check if email exists (must be before /:id)
router.get('/check-email', requireRole('super_admin', 'union_admin'), userController.checkEmail);

// Get user by ID
router.get('/:id', requireRole('super_admin', 'union_admin'), userController.getById);

// Update user (super admin and union admin)
router.put(
  '/:id',
  requireRole('super_admin', 'union_admin'),
  requirePermission('user.update'),
  userController.update
);

// Update user password (super admin and union admin)
router.patch(
  '/:id/password',
  requireRole('super_admin', 'union_admin'),
  requirePermission('user.password_update'),
  userController.updatePassword
);

// Delete user (super admin only)
router.delete(
  '/:id',
  requireRole('super_admin', 'union_admin'),
  requirePermission('user.delete'),
  userController.remove
);

export default router;
