import express from 'express';
import { runAutoGenerateInvoices } from '../controllers/invoiceController.js';

const router = express.Router();

/**
 * Secure cron endpoint for external schedulers (e.g. cron-job.org).
 * Requires CRON_SECRET or INVOICE_AUTO_GENERATE_CRON_SECRET in env.
 * Send secret via header: X-Cron-Secret: <secret> or Authorization: Bearer <secret>
 */
const getCronSecret = () =>
  process.env.INVOICE_AUTO_GENERATE_CRON_SECRET || process.env.CRON_SECRET;

const validateCronSecret = (req) => {
  const secret = getCronSecret();
  if (!secret) return { valid: false, reason: 'Cron secret not configured' };
  const provided =
    req.headers['x-cron-secret'] ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null) ||
    req.query.secret;
  if (!provided) return { valid: false, reason: 'Missing secret' };
  if (provided !== secret) return { valid: false, reason: 'Invalid secret' };
  return { valid: true };
};

// POST /api/cron/auto-generate-invoices — trigger invoice auto-generation (cron secret required)
router.post('/auto-generate-invoices', async (req, res) => {
  const { valid, reason } = validateCronSecret(req);
  if (!valid) {
    if (reason === 'Cron secret not configured') {
      return res.status(503).json({
        success: false,
        message: 'Cron endpoint not configured. Set CRON_SECRET or INVOICE_AUTO_GENERATE_CRON_SECRET in env.',
      });
    }
    return res.status(401).json({
      success: false,
      message: reason === 'Missing secret' ? 'Missing X-Cron-Secret header or Authorization Bearer token' : 'Invalid secret',
    });
  }

  try {
    const result = await runAutoGenerateInvoices();
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Cron auto-generate invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to auto-generate invoices',
      error: error.message,
    });
  }
});

export default router;
