/**
 * Audit log service – record who did what, when, for accountability and legal protection.
 * Call after successful mutations; does not throw (logs errors only).
 */
import { query } from '../config/database.js';

/**
 * @param {object} req - Express request (for user, ip, user-agent)
 * @param {object} opts - { action, resourceType, resourceId, societyId, details }
 */
export async function log(req, opts = {}) {
  const { action, resourceType, resourceId, societyId, details } = opts;
  if (!action || !resourceType) return;

  const userId = req?.user?.id ?? null;
  const role = req?.user?.role ?? null;
  const ip = req?.ip || req?.connection?.remoteAddress || null;
  const userAgent = req?.get?.('user-agent') || null;

  try {
    await query(
      `INSERT INTO audit_log (user_id, role, action, resource_type, resource_id, society_apartment_id, details, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        role,
        String(action).slice(0, 80),
        String(resourceType).slice(0, 80),
        resourceId != null ? String(resourceId).slice(0, 100) : null,
        societyId ?? null,
        details && typeof details === 'object' ? JSON.stringify(details) : null,
        ip ? String(ip).slice(0, 45) : null,
        userAgent ? String(userAgent).slice(0, 500) : null,
      ]
    );
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}
