import express from 'express';
import * as residentController from '../controllers/residentController.js';
import * as familyMemberController from '../controllers/familyMemberController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all residents
router.get('/', residentController.getAll);

// Family members for a resident (must be before /:id to avoid "family-members" as id)
router.get('/:id/family-members', familyMemberController.getByResidentId);
router.post('/:id/family-members', requireRole('super_admin', 'union_admin'), familyMemberController.create);
router.put('/:id/family-members/:fmId', requireRole('super_admin', 'union_admin'), familyMemberController.update);
router.delete('/:id/family-members/:fmId', requireRole('super_admin', 'union_admin'), familyMemberController.remove);

// Get resident by ID
router.get('/:id', residentController.getById);

// Create resident (admin only)
router.post('/', requireRole('super_admin', 'union_admin'), residentController.create);

// Update resident (admin only)
router.put('/:id', requireRole('super_admin', 'union_admin'), residentController.update);

// Delete resident (admin only)
router.delete('/:id', requireRole('super_admin', 'union_admin'), residentController.remove);

export default router;
