import { query } from '../config/database.js';

export const requirePermission = (...permissions) => {
  const required = Array.isArray(permissions[0]) ? permissions[0] : permissions;

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      if (req.user.role === 'super_admin') {
        return next();
      }

      const result = await query(
        `SELECT permission_key, enabled
         FROM role_permissions
         WHERE role = $1`,
        [req.user.role]
      );

      // Backward compatibility: if no explicit matrix exists for role yet, keep role-based behavior.
      if (!result.rows.length) {
        return next();
      }

      const granted = new Set(
        result.rows.filter((r) => r.enabled).map((r) => r.permission_key)
      );

      const allowed = required.some((p) => granted.has(p));
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: `Missing required permission: ${required.join(' or ')}`,
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error.message,
      });
    }
  };
};
