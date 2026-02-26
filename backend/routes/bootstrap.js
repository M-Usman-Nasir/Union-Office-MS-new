import express from 'express';
import { bootstrap } from '../controllers/bootstrapController.js';

const router = express.Router();
router.post('/', bootstrap);
export default router;
