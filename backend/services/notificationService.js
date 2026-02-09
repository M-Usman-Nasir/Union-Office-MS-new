import { query } from '../config/database.js';
import { sendDuesGeneratedEmail, sendPendingDuesReminderEmail } from './emailService.js';
import webPush from 'web-push';

const vapidPublic = process.env.VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
if (vapidPublic && vapidPrivate) {
  webPush.setVapidDetails(
    'mailto:' + (process.env.FROM_EMAIL || 'noreply@union.local'),
    vapidPublic,
    vapidPrivate
  );
}

/**
 * Get resident email(s) for a unit (users with role resident and unit_id = unitId).
 */
export async function getResidentEmailsForUnit(unitId) {
  const result = await query(
    `SELECT email FROM users WHERE unit_id = $1 AND role = 'resident' AND is_active = true AND email IS NOT NULL AND email != ''`,
    [unitId]
  );
  return result.rows.map((r) => r.email);
}

/**
 * Get resident user id(s) for a unit.
 */
export async function getResidentUserIdsForUnit(unitId) {
  const result = await query(
    `SELECT id FROM users WHERE unit_id = $1 AND role = 'resident' AND is_active = true`,
    [unitId]
  );
  return result.rows.map((r) => r.id);
}

async function getSubscriptionsForUser(userId) {
  const result = await query(
    'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1',
    [userId]
  ).catch(() => ({ rows: [] }));
  return result.rows.map((r) => ({
    endpoint: r.endpoint,
    keys: { p256dh: r.p256dh, auth: r.auth },
  }));
}

/**
 * Send push notification to a user.
 */
export async function sendPushToUser(userId, payload) {
  if (!vapidPublic || !vapidPrivate) return;
  const subs = await getSubscriptionsForUser(userId);
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  for (const sub of subs) {
    try {
      await webPush.sendNotification(sub, body);
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await query('DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2', [
          userId,
          sub.endpoint,
        ]).catch(() => {});
      }
    }
    // one push per user is enough
    break;
  }
}

/**
 * Get society setting (e.g. email_dues_on_generate).
 */
export async function getSocietySetting(societyId, key) {
  const result = await query(
    'SELECT * FROM settings WHERE society_apartment_id = $1',
    [societyId]
  );
  if (result.rows.length === 0) return key === 'email_reminder_days_before' ? 0 : false;
  const row = result.rows[0];
  if (key === 'email_dues_on_generate') return row.email_dues_on_generate === true;
  if (key === 'email_reminder_days_before') return parseInt(row.email_reminder_days_before, 10) || 0;
  return null;
}

/**
 * Send "dues generated" email and push to residents of the unit if settings enabled.
 */
export async function notifyDuesGenerated(unitId, societyId, unitNumber, societyName, month, year, amount, dueDate) {
  const emailEnabled = await getSocietySetting(societyId, 'email_dues_on_generate');
  const dueStr = dueDate ? new Date(dueDate).toLocaleDateString('en-PK') : 'N/A';
  const unitLabel = unitNumber || `Unit ${unitId}`;

  if (emailEnabled) {
    const emails = await getResidentEmailsForUnit(unitId);
    if (emails.length > 0) {
      await sendDuesGeneratedEmail({
        toEmails: emails,
        unitNumber: unitLabel,
        societyName: societyName || 'Union',
        month,
        year,
        amount,
        dueDate: dueStr,
      });
    }
  }

  const userIds = await getResidentUserIdsForUnit(unitId);
  const pushPayload = {
    title: 'Maintenance dues generated',
    body: `${unitLabel}: PKR ${amount} for ${new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })} ${year}. Due: ${dueStr}`,
    tag: 'dues-generated',
    url: '/resident/maintenance',
  };
  for (const uid of userIds) {
    sendPushToUser(uid, pushPayload).catch(() => {});
  }
}

/**
 * Send "pending dues reminder" emails and push for:
 * - Overdue: due_date < today, status = pending
 * - Due soon: due_date within the next N days (when email_reminder_days_before > 0)
 */
export async function sendPendingDuesReminders() {
  const societies = await query(
    'SELECT society_apartment_id FROM settings WHERE email_reminder_days_before > 0'
  );
  for (const { society_apartment_id: societyId } of societies.rows) {
    const days = await getSocietySetting(societyId, 'email_reminder_days_before');
    if (days <= 0) continue;
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + days);
    const toDateStr = toDate.toISOString().slice(0, 10);
    // Include overdue (due_date < today) and due within next N days
    const maintenanceRows = await query(
      `SELECT m.id, m.unit_id, m.total_amount, m.due_date, m.amount_paid,
              u.unit_number, s.name as society_name
       FROM maintenance m
       LEFT JOIN units u ON m.unit_id = u.id
       LEFT JOIN apartments s ON m.society_apartment_id = s.id
       WHERE m.society_apartment_id = $1 AND m.status = 'pending'
         AND m.due_date IS NOT NULL AND m.due_date <= $2`,
      [societyId, toDateStr]
    );
    for (const row of maintenanceRows.rows) {
      const dueStr = row.due_date ? new Date(row.due_date).toLocaleDateString('en-PK') : 'N/A';
      const amountDue = parseFloat(row.total_amount) - parseFloat(row.amount_paid || 0);
      const unitLabel = row.unit_number || `Unit ${row.unit_id}`;

      const emails = await getResidentEmailsForUnit(row.unit_id);
      if (emails.length > 0) {
        await sendPendingDuesReminderEmail({
          toEmails: emails,
          unitNumber: unitLabel,
          societyName: row.society_name || 'Union',
          amount: amountDue,
          dueDate: dueStr,
        });
      }

      const userIds = await getResidentUserIdsForUnit(row.unit_id);
      const pushPayload = {
        title: 'Reminder: Pending dues',
        body: `${unitLabel}: PKR ${amountDue} due by ${dueStr}`,
        tag: 'dues-reminder',
        url: '/resident/maintenance',
      };
      for (const uid of userIds) {
        sendPushToUser(uid, pushPayload).catch(() => {});
      }
    }
  }
}
