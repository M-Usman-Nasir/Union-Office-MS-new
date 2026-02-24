import express from 'express';
import * as employeesController from '../controllers/employeesController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('union_admin'));

router.get('/', employeesController.getAll);
router.get('/:id', employeesController.getById);
router.post('/', employeesController.create);
router.put('/:id', employeesController.update);
router.delete('/:id', employeesController.remove);

export default router;
