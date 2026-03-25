import crypto from 'crypto';
import { processIncomingWebhook } from '../services/whatsapp/actionRouter.js';

const verifyWebhookSignature = (req) => {
  const appSecret = process.env.WA_APP_SECRET;
  if (!appSecret) return true;

  const signature = req.headers['x-hub-signature-256'];
  if (!signature || !String(signature).startsWith('sha256=')) {
    return false;
  }
  const incomingHash = String(signature).slice(7);
  const rawBody = req.rawBody || '';
  const expectedHash = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(expectedHash));
};

export const verifyMetaWebhook = async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!mode || !token || !challenge) {
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook verification request',
    });
  }

  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({
    success: false,
    message: 'Webhook verification failed',
  });
};

export const handleMetaWebhook = async (req, res) => {
  if (process.env.WHATSAPP_ENABLED !== 'true') {
    return res.status(200).json({ success: true, message: 'WhatsApp integration disabled' });
  }

  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid webhook signature',
    });
  }

  try {
    await processIncomingWebhook(req.body || {});
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Meta webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message,
    });
  }
};
