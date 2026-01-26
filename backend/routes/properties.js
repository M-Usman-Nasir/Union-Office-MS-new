import express from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Blocks routes
router.get('/blocks', propertyController.getBlocks);
router.post('/blocks', requireRole('super_admin'), propertyController.createBlock);

// Floors routes
router.get('/floors', propertyController.getFloors);
router.post('/floors', requireRole('super_admin'), propertyController.createFloor);

// Units routes
router.get('/units', propertyController.getUnits);
router.get('/units/:id', propertyController.getUnitById);
router.post('/units', requireRole('super_admin', 'union_admin'), propertyController.createUnit);
router.put('/units/:id', requireRole('super_admin', 'union_admin'), propertyController.updateUnit);

export default router;
