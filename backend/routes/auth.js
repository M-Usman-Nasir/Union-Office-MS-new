import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { uploadProfileImage } from '../config/multer.js';
import {
  loginRateLimiter,
  refreshRateLimiter,
  registerResidentRateLimiter,
  changePasswordRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '../middleware/rateLimit.js';

const router = express.Router();

// Public routes
router.post('/login', loginRateLimiter, authController.login);
router.post('/refresh', refreshRateLimiter, authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/register/resident', registerResidentRateLimiter, authController.registerResident);
router.post('/forgot-password', forgotPasswordRateLimiter, authController.forgotPassword);
router.post('/reset-password', resetPasswordRateLimiter, authController.resetPassword);

// Protected routes
router.post('/change-password-first-login', authenticate, changePasswordRateLimiter, authController.changePasswordFirstLogin);
router.post('/change-password', authenticate, changePasswordRateLimiter, authController.changePassword);
router.post('/test-email', authenticate, requireRole('super_admin', 'union_admin'), changePasswordRateLimiter, authController.sendTestEmail);
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, uploadProfileImage, authController.updateMe);
router.post('/register', authenticate, requireRole('super_admin', 'union_admin'), authController.register);

export default router;
