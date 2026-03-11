import express from 'express';
import * as unionMembersController from '../controllers/unionMembersController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
// GET list and by-id: allowed for residents (view) and union_admin
router.get('/', unionMembersController.getAll);
router.get('/:id', unionMembersController.getById);
// Create, update, delete: union_admin only
router.post('/', requireRole('union_admin'), unionMembersController.create);
router.put('/:id', requireRole('union_admin'), unionMembersController.update);
router.delete('/:id', requireRole('union_admin'), unionMembersController.remove);

export default router;
