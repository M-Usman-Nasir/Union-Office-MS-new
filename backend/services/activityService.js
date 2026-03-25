import { query } from '../config/database.js';

export async function track(req, opts = {}) {
  const { eventType, resourceType, resourceId, societyId, details } = opts;
  if (!eventType || !resourceType) return;

  try {
    await query(
      `INSERT INTO activity_timeline
       (actor_user_id, actor_role, event_type, resource_type, resource_id, society_apartment_id, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        req?.user?.id ?? null,
        req?.user?.role ?? null,
        String(eventType).slice(0, 80),
        String(resourceType).slice(0, 80),
        resourceId != null ? String(resourceId).slice(0, 100) : null,
        societyId ?? null,
        details && typeof details === 'object' ? JSON.stringify(details) : null,
      ]
    );
  } catch (err) {
    console.error('Activity timeline write failed:', err.message);
  }
}
