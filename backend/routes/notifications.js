import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/vapid-public', notificationController.getVapidPublic);
router.post('/subscribe', notificationController.subscribe);

export default router;
