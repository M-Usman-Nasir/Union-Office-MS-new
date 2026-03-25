import { query } from '../../config/database.js';

const DEFAULT_PROVIDER = 'meta_cloud';
const DEFAULT_TTL_MINUTES = 30;

const expiresAtFromNow = (minutes = DEFAULT_TTL_MINUTES) =>
  new Date(Date.now() + minutes * 60 * 1000).toISOString();

export const getSession = async ({ senderPhone, flowKey, provider = DEFAULT_PROVIDER }) => {
  const result = await query(
    `SELECT id, provider, sender_phone, resident_user_id, flow_key, flow_state, expires_at
     FROM whatsapp_sessions
     WHERE provider = $1
       AND sender_phone = $2
       AND flow_key = $3
       AND expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [provider, senderPhone, flowKey]
  );
  return result.rows[0] || null;
};

export const saveSession = async ({
  senderPhone,
  residentUserId = null,
  flowKey,
  flowState = {},
  provider = DEFAULT_PROVIDER,
  ttlMinutes = DEFAULT_TTL_MINUTES,
}) => {
  const expiresAt = expiresAtFromNow(ttlMinutes);
  const result = await query(
    `INSERT INTO whatsapp_sessions (provider, sender_phone, resident_user_id, flow_key, flow_state, expires_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)
     ON CONFLICT (provider, sender_phone, flow_key)
     DO UPDATE SET
       resident_user_id = EXCLUDED.resident_user_id,
       flow_state = EXCLUDED.flow_state,
       expires_at = EXCLUDED.expires_at,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id, provider, sender_phone, resident_user_id, flow_key, flow_state, expires_at`,
    [provider, senderPhone, residentUserId, flowKey, JSON.stringify(flowState || {}), expiresAt]
  );
  return result.rows[0] || null;
};

export const deleteSession = async ({ senderPhone, flowKey, provider = DEFAULT_PROVIDER }) => {
  await query(
    `DELETE FROM whatsapp_sessions
     WHERE provider = $1 AND sender_phone = $2 AND flow_key = $3`,
    [provider, senderPhone, flowKey]
  );
};

export const cleanupExpiredSessions = async () => {
  await query('DELETE FROM whatsapp_sessions WHERE expires_at <= CURRENT_TIMESTAMP');
};
