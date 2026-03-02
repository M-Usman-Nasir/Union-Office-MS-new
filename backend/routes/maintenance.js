import express from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadMaintenanceReceipt, uploadResidentPaymentProof } from '../config/multer.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all maintenance records
router.get('/', maintenanceController.getAll);

// Get yearly ledger (must be before /:id)
router.get('/yearly-ledger', maintenanceController.getYearlyLedger);

// Payment requests: resident "my" list + admin list/approve/reject (must be before /:id)
router.get('/payment-requests/mine', maintenanceController.getMyPaymentRequests);
router.get('/payment-requests', requireRole('super_admin', 'union_admin'), maintenanceController.getPaymentRequests);
router.post('/payment-requests/:id/approve', requireRole('super_admin', 'union_admin'), maintenanceController.approvePaymentRequest);
router.post('/payment-requests/:id/reject', requireRole('super_admin', 'union_admin'), maintenanceController.rejectPaymentRequest);

// Resident: submit payment proof (resident only)
router.post('/:id/submit-payment-proof', requireRole('resident'), uploadResidentPaymentProof, maintenanceController.submitPaymentProof);

// Get maintenance by ID
router.get('/:id', maintenanceController.getById);

// Create maintenance record (admin only)
router.post('/', requireRole('super_admin', 'union_admin'), maintenanceController.create);

// Create maintenance for all units in one go (admin only)
router.post('/create-for-all-units', requireRole('super_admin', 'union_admin'), maintenanceController.createForAllUnits);

// Update maintenance record (admin only)
router.put('/:id', requireRole('super_admin', 'union_admin'), maintenanceController.update);

// Record payment
router.post('/:id/payment', requireRole('super_admin', 'union_admin'), maintenanceController.recordPayment);

// Upload receipt (must be before get/:id so path is matched)
router.post('/:id/upload-receipt', requireRole('super_admin', 'union_admin'), uploadMaintenanceReceipt, maintenanceController.uploadReceipt);

// Generate monthly dues manually (admin only; union_admin: their society only)
router.post('/generate-monthly-dues', requireRole(['super_admin', 'union_admin']), maintenanceController.generateMonthlyDues);

// Generate monthly dues for a block or floor (union_admin only)
router.post('/generate-for-scope', requireRole(['union_admin']), maintenanceController.generateForScope);

// Apply base amount to all units for all months of a year (union_admin only)
router.post('/apply-base-for-year', requireRole(['super_admin', 'union_admin']), maintenanceController.applyBaseForYear);

// Delete all maintenance for a year (admin only; must be before /:id)
router.delete('/by-year', requireRole('super_admin', 'union_admin'), maintenanceController.deleteByYear);

// Delete maintenance record (admin only)
router.delete('/:id', requireRole('super_admin', 'union_admin'), maintenanceController.remove);

export default router;
