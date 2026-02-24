import express from 'express';
import * as unionMembersController from '../controllers/unionMembersController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('union_admin'));

router.get('/', unionMembersController.getAll);
router.get('/:id', unionMembersController.getById);
router.post('/', unionMembersController.create);
router.put('/:id', unionMembersController.update);
router.delete('/:id', unionMembersController.remove);

export default router;
