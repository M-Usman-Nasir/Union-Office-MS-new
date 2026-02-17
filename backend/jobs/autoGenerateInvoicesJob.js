import cron from 'node-cron';
import { runAutoGenerateInvoices } from '../controllers/invoiceController.js';

/**
 * Schedule automatic invoice generation for union admins (monthly).
 * Runs on the 1st of every month at 00:05 (after monthly dues at 00:00).
 */
export const scheduleAutoGenerateInvoices = () => {
  cron.schedule('5 0 1 * *', async () => {
    try {
      console.log('[Cron] Auto-generate invoices: starting...');
      const result = await runAutoGenerateInvoices();
      console.log(`[Cron] Auto-generate invoices: ${result.message}`);
    } catch (error) {
      console.error('[Cron] Auto-generate invoices error:', error);
    }
  });

  console.log('Invoice auto-generate scheduler initialized (runs on 1st of every month at 00:05)');
};
