import express from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadUnitsImport } from '../config/multer.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Blocks routes
router.get('/blocks', propertyController.getBlocks);
router.get('/blocks/:id/next-floor', propertyController.getBlockNextFloorNumber);
router.post('/blocks', requireRole('super_admin'), propertyController.createBlock);
router.put('/blocks/:id', requireRole('super_admin'), propertyController.updateBlock);

// Floors routes
router.get('/floors', propertyController.getFloors);
router.post('/floors', requireRole('super_admin'), propertyController.createFloor);
router.put('/floors/:id', requireRole('super_admin'), propertyController.updateFloor);
router.delete('/floors/:id', requireRole('super_admin'), propertyController.deleteFloor);
router.post('/floors/:id/units', requireRole('super_admin'), propertyController.addUnitsToFloor);

// Units routes
router.get('/units', propertyController.getUnits);
router.get('/units/:id', propertyController.getUnitById);
router.post('/units/import', requireRole('super_admin'), uploadUnitsImport, propertyController.importUnits);
router.post('/units/bulk-emails', requireRole('super_admin'), propertyController.bulkSetUnitEmails);
router.post('/units', requireRole('super_admin'), propertyController.createUnit);
router.put('/units/:id', requireRole('super_admin'), propertyController.updateUnit);
router.delete('/units/:id', requireRole('super_admin'), propertyController.deleteUnit);

export default router;
