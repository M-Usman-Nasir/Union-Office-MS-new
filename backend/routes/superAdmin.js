import express from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/global', requireRole('super_admin'), superAdminController.getGlobalReports);

export default router;
