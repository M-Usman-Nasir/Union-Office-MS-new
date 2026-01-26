import express from 'express';
import * as societyController from '../controllers/societyController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all societies
router.get('/', societyController.getAll);

// Get society by ID
router.get('/:id', societyController.getById);

// Create society (super admin only)
router.post('/', requireRole('super_admin'), societyController.create);

// Update society (super admin only)
router.put('/:id', requireRole('super_admin'), societyController.update);

// Delete society (super admin only)
router.delete('/:id', requireRole('super_admin'), societyController.remove);

export default router;
