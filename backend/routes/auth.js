import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/register', authenticate, requireRole('super_admin', 'union_admin'), authController.register);

export default router;
