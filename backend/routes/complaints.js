import express from 'express';
import * as complaintController from '../controllers/complaintController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { uploadComplaintAttachments } from '../config/multer.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all complaints
router.get('/', complaintController.getAll);

// Get complaint statistics (must be before /:id)
router.get('/statistics', complaintController.getStatistics);

// Create complaint with attachments (multipart/form-data)
router.post(
  '/with-attachments',
  requirePermission('complaint.create'),
  uploadComplaintAttachments,
  complaintController.createWithAttachments
);

// Get complaint by ID
router.get('/:id', complaintController.getById);

// Create complaint (JSON body, no attachments)
router.post('/', requirePermission('complaint.create'), complaintController.create);

// Update complaint
router.put('/:id', requirePermission('complaint.update'), complaintController.update);

// Update complaint status (admin only)
router.patch(
  '/:id/status',
  requireRole('super_admin', 'union_admin'),
  requirePermission('complaint.status_update'),
  complaintController.updateStatus
);

// Submit resident feedback after complaint resolution
router.patch(
  '/:id/feedback',
  requireRole('resident'),
  complaintController.submitFeedback
);

// Assign staff to complaint (admin only)
router.patch(
  '/:id/assign',
  requireRole(['super_admin', 'union_admin']),
  requirePermission('complaint.assign'),
  complaintController.assignStaff
);

// Add progress update (admin/staff)
router.post(
  '/:id/progress',
  requireRole(['super_admin', 'union_admin', 'staff']),
  requirePermission('complaint.progress_add'),
  complaintController.addProgress
);

// Escalate to super admin (union_admin or resident)
router.post(
  '/:id/escalate',
  requireRole(['super_admin', 'union_admin', 'resident']),
  requirePermission('complaint.escalate'),
  complaintController.escalate
);

// Get progress history
router.get('/:id/progress', complaintController.getProgress);

// Delete complaint
router.delete('/:id', requirePermission('complaint.delete'), complaintController.remove);

export default router;
