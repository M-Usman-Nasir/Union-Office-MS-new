import express from 'express';
import * as staffController from '../controllers/staffController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.use(requireRole('staff'));

router.get('/complaints', staffController.getAssignedComplaints);
router.get('/payments', staffController.getPayments);
router.patch('/payments/:id', staffController.updatePaymentStatus);

export default router;
