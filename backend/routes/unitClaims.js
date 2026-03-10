import express from 'express';
import * as unitClaimsController from '../controllers/unitClaimsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Resident: get my claim
router.get('/mine', unitClaimsController.getMyClaim);
// Resident: submit claim (resident only)
router.post('/', requireRole('resident'), unitClaimsController.createClaim);

// Union Admin / Super Admin: list claims, approve, reject
router.get('/', requireRole('super_admin', 'union_admin'), unitClaimsController.getAllClaims);
router.post('/:id/approve', requireRole('super_admin', 'union_admin'), unitClaimsController.approveClaim);
router.post('/:id/reject', requireRole('super_admin', 'union_admin'), unitClaimsController.rejectClaim);

export default router;
