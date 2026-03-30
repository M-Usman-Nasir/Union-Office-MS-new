/**
 * Multi-UI context: only for super_admin users with hidden_from_ui (private owner account).
 * Frontend sends X-Hums-Ui-* headers so that user can drive union_admin / resident / staff APIs.
 */
import { query } from '../config/database.js';

export function isMultiUiSuperAdmin(req) {
  return req.user?.role === 'super_admin' && req.user?.hidden_from_ui === true;
}

function parseIdHeader(req, headerName) {
  const h = req.get(headerName);
  if (h == null || String(h).trim() === '') return null;
  const s = String(h).trim();
  if (!/^\d+$/.test(s)) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

/** Society for union-admin-scoped actions (header overrides for multi-UI; else real union_admin row). */
export function getUiSocietyId(req) {
  if (req.user?.role === 'union_admin' && req.user.society_apartment_id) {
    return req.user.society_apartment_id;
  }
  if (isMultiUiSuperAdmin(req)) {
    return parseIdHeader(req, 'x-hums-ui-society-id');
  }
  return null;
}

export function getUiResidentIdSync(req) {
  if (req.user?.role === 'resident') return req.user.id;
  if (isMultiUiSuperAdmin(req)) {
    return parseIdHeader(req, 'x-hums-ui-resident-id');
  }
  return null;
}

export function getUiStaffIdSync(req) {
  if (req.user?.role === 'staff') return req.user.id;
  if (isMultiUiSuperAdmin(req)) {
    return parseIdHeader(req, 'x-hums-ui-staff-id');
  }
  return null;
}

/** Society for list endpoints usable by resident (their society) or multi-UI resident header. */
export async function getScopedSocietyId(req) {
  const fromUi = getUiSocietyId(req);
  if (fromUi) return fromUi;
  if (req.user?.role === 'resident' && req.user.society_apartment_id) {
    return req.user.society_apartment_id;
  }
  if (isMultiUiSuperAdmin(req)) {
    const rid = getUiResidentIdSync(req);
    if (rid) {
      const r = await query(
        `SELECT society_apartment_id FROM users WHERE id = $1 AND role = 'resident' AND deleted_at IS NULL`,
        [rid]
      );
      return r.rows[0]?.society_apartment_id ?? null;
    }
  }
  return null;
}

export async function getResidentRowForMultiUi(req) {
  const rid = getUiResidentIdSync(req);
  if (!rid) return null;
  const r = await query(
    `SELECT id, unit_id, society_apartment_id FROM users WHERE id = $1 AND role = 'resident' AND deleted_at IS NULL`,
    [rid]
  );
  return r.rows[0] || null;
}
