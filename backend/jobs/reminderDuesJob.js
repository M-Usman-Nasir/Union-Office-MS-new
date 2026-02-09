import cron from 'node-cron';
import { sendPendingDuesReminders } from '../services/notificationService.js';

/**
 * Schedule daily run to send pending dues reminder emails
 * (for societies that have email_reminder_days_before > 0).
 */
export function scheduleReminderDues() {
  cron.schedule('0 9 * * *', async () => {
    try {
      await sendPendingDuesReminders();
    } catch (error) {
      console.error('Reminder dues job error:', error);
    }
  });
  console.log('Reminder dues scheduler initialized (runs daily at 09:00)');
}
