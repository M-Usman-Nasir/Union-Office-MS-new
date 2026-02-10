import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();
router.use(authenticate);

router.get('/conversations', messageController.getConversations);
router.get('/partners', messageController.getChatPartners);
router.get('/with/:userId', messageController.getMessagesWith);
router.post('/', messageController.sendMessage);

export default router;
