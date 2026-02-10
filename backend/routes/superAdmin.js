import express from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/global', requireRole('super_admin'), superAdminController.getGlobalReports);

// Subscription & admins (Super Admin only)
router.get('/subscription/plans', requireRole('super_admin'), subscriptionController.getPlans);
router.get('/subscription/admins', requireRole('super_admin'), subscriptionController.getAdminsWithSubscriptions);
router.post('/subscription', requireRole('super_admin'), subscriptionController.createSubscription);
router.patch('/subscription/:id', requireRole('super_admin'), subscriptionController.updateSubscriptionStatus);

export default router;
