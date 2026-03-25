import { query } from '../config/database.js';

export const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const result = await query(
      `SELECT permission_key, enabled, updated_at
       FROM role_permissions
       WHERE role = $1
       ORDER BY permission_key`,
      [role]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch role permissions', error: error.message });
  }
};

export const upsertRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body || {};
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({ success: false, message: 'Body must include permissions object' });
    }

    for (const key of Object.keys(permissions)) {
      if (typeof permissions[key] !== 'boolean') continue;
      await query(
        `INSERT INTO role_permissions (role, permission_key, enabled, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (role, permission_key)
         DO UPDATE SET enabled = $3, updated_at = CURRENT_TIMESTAMP`,
        [role, key, permissions[key]]
      );
    }

    const result = await query(
      `SELECT permission_key, enabled, updated_at
       FROM role_permissions
       WHERE role = $1
       ORDER BY permission_key`,
      [role]
    );
    res.json({ success: true, message: 'Role permissions updated', data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update role permissions', error: error.message });
  }
};

export const listGlobalFeatures = async (_req, res) => {
  try {
    const result = await query(
      `SELECT feature_key, enabled, updated_at, updated_by
       FROM global_feature_flags
       ORDER BY feature_key`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch global feature flags', error: error.message });
  }
};

export const upsertGlobalFeatures = async (req, res) => {
  try {
    const { features } = req.body || {};
    if (!features || typeof features !== 'object') {
      return res.status(400).json({ success: false, message: 'Body must include features object' });
    }

    for (const key of Object.keys(features)) {
      if (typeof features[key] !== 'boolean') continue;
      await query(
        `INSERT INTO global_feature_flags (feature_key, enabled, updated_by, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (feature_key)
         DO UPDATE SET enabled = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP`,
        [key, features[key], req.user?.id || null]
      );
    }

    const result = await query(
      `SELECT feature_key, enabled, updated_at, updated_by
       FROM global_feature_flags
       ORDER BY feature_key`
    );
    res.json({ success: true, message: 'Global feature flags updated', data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update global feature flags', error: error.message });
  }
};

/**
 * GET /api/super-admin/activity-timeline
 * Query: resource_type, resource_id, action (exact event_type), action_prefix (ILIKE prefix%),
 *        user_id (actor), role (actor_role), society_id, date_from, date_to (ISO timestamps),
 *        page, limit (max 200)
 */
export const activityTimeline = async (req, res) => {
  try {
    const q = req.query || {};
    const pageNum = Math.max(parseInt(String(q.page || '1'), 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(String(q.limit || '50'), 10) || 50, 1), 200);
    const offset = (pageNum - 1) * limitNum;

    const filters = [];
    const params = [];

    if (q.resource_type) {
      params.push(String(q.resource_type));
      filters.push(`resource_type = $${params.length}`);
    }
    if (q.resource_id != null && q.resource_id !== '') {
      params.push(String(q.resource_id));
      filters.push(`resource_id = $${params.length}`);
    }
    if (q.action_prefix) {
      params.push(`${String(q.action_prefix)}%`);
      filters.push(`event_type ILIKE $${params.length}`);
    } else if (q.action) {
      params.push(String(q.action));
      filters.push(`event_type = $${params.length}`);
    }
    if (q.user_id != null && q.user_id !== '') {
      const uid = parseInt(String(q.user_id), 10);
      if (!Number.isNaN(uid)) {
        params.push(uid);
        filters.push(`actor_user_id = $${params.length}`);
      }
    }
    if (q.role) {
      params.push(String(q.role));
      filters.push(`actor_role = $${params.length}`);
    }
    if (q.society_id != null && q.society_id !== '') {
      const sid = parseInt(String(q.society_id), 10);
      if (!Number.isNaN(sid)) {
        params.push(sid);
        filters.push(`society_apartment_id = $${params.length}`);
      }
    }
    if (q.date_from) {
      params.push(String(q.date_from));
      filters.push(`created_at >= $${params.length}::timestamptz`);
    }
    if (q.date_to) {
      params.push(String(q.date_to));
      filters.push(`created_at <= $${params.length}::timestamptz`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM activity_timeline ${whereClause}`,
      [...params]
    );
    const total = parseInt(countResult.rows[0]?.total ?? 0, 10) || 0;

    const listParams = [...params, limitNum, offset];
    const limPos = listParams.length - 1;
    const offPos = listParams.length;

    const result = await query(
      `SELECT id, created_at, actor_user_id AS user_id, actor_role AS role, event_type AS action,
              resource_type, resource_id, society_apartment_id, details
       FROM activity_timeline
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${limPos} OFFSET $${offPos}`,
      listParams
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: limitNum > 0 ? Math.ceil(total / limitNum) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity timeline', error: error.message });
  }
};
