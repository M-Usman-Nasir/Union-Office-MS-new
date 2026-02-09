# Pending Dues Notifications – Implementation Outline (Optional)

This document outlines how to add **push or email notifications** for pending maintenance dues, so residents are notified beyond the current on-dashboard visibility.

---

## Current Behavior

- Residents see pending dues on the **Dashboard** (e.g. “Pending Maintenance” count, defaulter “Amount due”, “No pending dues”).
- No out-of-app notifications (email or push) are sent.

---

## Option A: Email Notifications

### Backend

1. **Email service**
   - Add a transport (e.g. **Nodemailer** with SMTP or a provider like SendGrid/Mailgun).
   - Environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`.

2. **When to send**
   - **Monthly dues generated:** After `monthlyDuesGenerator` runs (or after admin clicks “Generate Monthly Dues”), for each unit with a new maintenance record, send one email to the resident(s) of that unit (e.g. “Your maintenance dues for Month Year are PKR X. Due date: …”).
   - **Reminder (optional):** A scheduled job (e.g. weekly or a few days before due date) that finds units with `status = 'pending'` and `due_date` in the next 7 days, and sends a “Reminder: pending dues” email.

3. **Resident email**
   - Use `users.email` for the unit’s resident (or a dedicated contact). You may need to resolve resident from `unit_id` (e.g. `users.unit_id = unit.id` and `role = 'resident'`) or from a `residents`/occupant table if you have one.

4. **APIs**
   - Optional: `POST /api/notifications/send-pending-dues-reminder` (admin or cron-only) to trigger reminder emails for a given society or all.

### Frontend

- **Settings (admin):** Optional toggles, e.g. “Email residents when monthly dues are generated”, “Send reminder emails X days before due date”.
- Store these in `settings` (e.g. `email_dues_on_generate`, `email_reminder_days_before`).

---

## Option B: Push Notifications (Web / Mobile)

### Backend

1. **Subscription storage**
   - Table e.g. `push_subscriptions (user_id, endpoint, p256dh, auth, created_at)` to store Web Push subscription (VAPID) or FCM tokens for mobile.

2. **Send push**
   - Use **web-push** (Node) for Web Push (VAPID keys in env), or Firebase Admin SDK for FCM.
   - When sending “pending dues” notification, same triggers as email (e.g. after dues generation, or reminder job). Load subscription(s) for the resident user and call the push API.

3. **APIs**
   - `POST /api/notifications/subscribe` (authenticated): body = subscription object; save/update for `req.user.id`.
   - Cron or internal: “send pending dues push” for units with pending dues (and optionally filter by due date).

### Frontend

1. **Request permission** (browser): `Notification.requestPermission()`.
2. **Subscribe:** Use Service Worker + PushManager to create a subscription; send it to `POST /api/notifications/subscribe`.
3. **Service Worker:** Register a service worker that handles `push` events and shows a notification (e.g. “You have pending maintenance dues: PKR X”).
4. **Settings (admin):** Optional “Enable push notifications for residents” (and possibly per-resident opt-in in profile).

---

## Suggested Order

1. **Email first:** Smaller scope, uses existing `users.email`, no client subscription. Implement Nodemailer + “dues generated” email, then optional reminder job.
2. **Settings:** Add toggles for “email on dues generated” and “reminder N days before” (and store in DB).
3. **Push later:** Add subscription table + web-push (or FCM), subscribe from frontend, then re-use the same “pending dues” logic to send push instead of or in addition to email.

---

## Files to Touch (Email – minimal)

- **Backend:** New `backend/services/emailService.js` (or `notifications/email.js`), `backend/jobs/monthlyDuesGenerator.js` (after creating dues, call email service if setting enabled), optional `backend/jobs/reminderDuesJob.js`, new or existing `settings` columns for email toggles.
- **Frontend:** Admin Settings – new section “Notification preferences” with toggles; optional resident “Notification preferences” if you add per-user email/push opt-in later.

This outline is optional; the app is fully functional without it. The dashboard already “notifies” residents of pending dues by displaying them.
