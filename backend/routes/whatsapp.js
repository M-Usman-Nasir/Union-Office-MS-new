import express from 'express';
import { handleMetaWebhook, verifyMetaWebhook } from '../controllers/whatsappController.js';
import { whatsappWebhookRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.get('/webhook', verifyMetaWebhook);
router.post('/webhook', whatsappWebhookRateLimiter, handleMetaWebhook);

export default router;
