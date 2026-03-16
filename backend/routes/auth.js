import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadProfileImage } from '../config/multer.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/register/resident', authController.registerResident);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, uploadProfileImage, authController.updateMe);
router.post('/register', authenticate, requireRole('super_admin', 'union_admin'), authController.register);

export default router;
