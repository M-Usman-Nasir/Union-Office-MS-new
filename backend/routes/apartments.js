import express from 'express';
import * as apartmentController from '../controllers/apartmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Cascading selection: City → Area → Apartment (must be before /:id)
router.get('/cities', apartmentController.getCities);
router.get('/areas', apartmentController.getAreas);

// Get all apartments (optional query: city, area, search)
router.get('/', apartmentController.getAll);

// Get apartment by ID
router.get('/:id', apartmentController.getById);

// Create apartment (super admin only)
router.post('/', requireRole('super_admin'), apartmentController.create);

// Update apartment (super admin only)
router.put('/:id', requireRole('super_admin'), apartmentController.update);

// Delete apartment (super admin only)
router.delete('/:id', requireRole('super_admin'), apartmentController.remove);

export default router;
