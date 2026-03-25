import express from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import * as subscriptionController from '../controllers/subscriptionController.js';
import * as invoiceController from '../controllers/invoiceController.js';
import * as migrationsController from '../controllers/migrationsController.js';
import * as auditLogController from '../controllers/auditLogController.js';
import * as escalationsController from '../controllers/escalationsController.js';
import * as governanceController from '../controllers/governanceController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadInvoicePaymentProof } from '../config/multer.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/global', requireRole('super_admin'), superAdminController.getGlobalReports);

// Audit logs (super admin only)
router.get('/audit-logs', requireRole('super_admin'), auditLogController.list);

// Escalations – disputes resolved by super admin
router.get('/escalations', requireRole('super_admin'), escalationsController.list);
router.patch('/escalations/:id/resolve', requireRole('super_admin'), escalationsController.resolve);

// Migrations (Super Admin only – e.g. for production when Shell is not available)
router.post('/run-migrations', requireRole('super_admin'), migrationsController.runMigrationsHandler);

// Invoices (Super Admin only)
router.get('/invoices', requireRole('super_admin'), invoiceController.listInvoices);
router.post('/invoices', requireRole('super_admin'), invoiceController.createInvoice);
router.post('/invoices/auto-generate', requireRole('super_admin'), invoiceController.autoGenerateInvoices);
router.patch('/invoices/:id', requireRole('super_admin'), invoiceController.updateInvoiceStatus);
router.post(
  '/invoices/:id/upload-payment-proof',
  requireRole('super_admin'),
  uploadInvoicePaymentProof,
  invoiceController.uploadPaymentProof
);

// Subscription & admins (Super Admin only)
router.get('/subscription/plans', requireRole('super_admin'), subscriptionController.getPlans);
router.post('/subscription/plans', requireRole('super_admin'), subscriptionController.createPlan);
router.patch('/subscription/plans/:id', requireRole('super_admin'), subscriptionController.updatePlan);
router.get('/subscription/admins', requireRole('super_admin'), subscriptionController.getAdminsWithSubscriptions);
router.post('/subscription', requireRole('super_admin'), subscriptionController.createSubscription);
router.patch('/subscription/:id', requireRole('super_admin'), subscriptionController.updateSubscriptionStatus);

// Governance (P2/P3 foundations)
router.get('/activity-timeline', requireRole('super_admin'), governanceController.activityTimeline);
router.get('/permissions/:role', requireRole('super_admin'), governanceController.getRolePermissions);
router.put('/permissions/:role', requireRole('super_admin'), governanceController.upsertRolePermissions);
router.get('/global-features', requireRole('super_admin'), governanceController.listGlobalFeatures);
router.put('/global-features', requireRole('super_admin'), governanceController.upsertGlobalFeatures);

export default router;
