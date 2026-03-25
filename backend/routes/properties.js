import express from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { uploadUnitsImport } from '../config/multer.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Blocks routes
router.get('/blocks', propertyController.getBlocks);
router.get('/blocks/:id/next-floor', propertyController.getBlockNextFloorNumber);
router.post('/blocks', requireRole('super_admin'), requirePermission('property.block.create'), propertyController.createBlock);
router.post(
  '/blocks/seed-missing-floors',
  requireRole('super_admin'),
  requirePermission('property.block.seed'),
  propertyController.seedMissingFloorsForSociety
);
router.put('/blocks/:id', requireRole('super_admin'), requirePermission('property.block.update'), propertyController.updateBlock);

// Floors routes
router.get('/floors', propertyController.getFloors);
router.post('/floors', requireRole('super_admin'), requirePermission('property.floor.create'), propertyController.createFloor);
router.put('/floors/:id', requireRole('super_admin'), requirePermission('property.floor.update'), propertyController.updateFloor);
router.delete('/floors/:id', requireRole('super_admin'), requirePermission('property.floor.delete'), propertyController.deleteFloor);
router.post('/floors/:id/units', requireRole('super_admin'), requirePermission('property.floor.add_units'), propertyController.addUnitsToFloor);

// Units routes
router.get('/units', propertyController.getUnits);
router.get(
  '/units/:id/login-email-preview',
  requireRole('super_admin', 'union_admin'),
  propertyController.getUnitLoginEmailPreview
);
router.get('/units/:id', propertyController.getUnitById);
router.post('/units/import', requireRole('super_admin'), requirePermission('property.unit.import'), uploadUnitsImport, propertyController.importUnits);
router.post('/units', requireRole('super_admin'), requirePermission('property.unit.create'), propertyController.createUnit);
router.put('/units/:id', requireRole('super_admin'), requirePermission('property.unit.update'), propertyController.updateUnit);
router.delete('/units/:id', requireRole('super_admin'), requirePermission('property.unit.delete'), propertyController.deleteUnit);

export default router;
