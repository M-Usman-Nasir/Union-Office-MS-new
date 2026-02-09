import { query } from '../config/database.js';

/**
 * POST /api/notifications/subscribe – save push subscription for current user
 */
export const subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({
        success: false,
        message: 'endpoint and keys.p256dh, keys.auth are required',
      });
    }
    await query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
      [userId, endpoint, keys.p256dh, keys.auth]
    );
    res.json({ success: true, message: 'Subscription saved' });
  } catch (err) {
    if (err.message && err.message.includes('push_subscriptions')) {
      return res.status(503).json({
        success: false,
        message: 'Push notifications not available. Run migration 012.',
      });
    }
    console.error('Push subscribe error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save subscription',
      error: err.message,
    });
  }
};

/**
 * GET /api/notifications/vapid-public – return public VAPID key for client
 */
export const getVapidPublic = (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return res.status(503).json({
      success: false,
      message: 'Push notifications not configured (VAPID_PUBLIC_KEY)',
    });
  }
  res.json({ success: true, data: { publicKey: key } });
};
