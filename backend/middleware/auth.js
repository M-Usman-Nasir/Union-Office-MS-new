import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// Verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header must be: Bearer <token>',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const result = await query(
      `SELECT id, email, name, role, society_apartment_id, unit_id,
              COALESCE(must_change_password, false) AS must_change_password
       FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      });
    }

    req.user = result.rows[0];

    const path = (req.originalUrl || req.url || '').split('?')[0];
    const method = (req.method || 'GET').toUpperCase();
    const exempt =
      (path.endsWith('/auth/me') && method === 'GET') ||
      (path.endsWith('/auth/change-password-first-login') && method === 'POST') ||
      (path.endsWith('/auth/change-password') && method === 'POST') ||
      (path.endsWith('/auth/logout') && method === 'POST') ||
      (path.endsWith('/auth/refresh') && method === 'POST');

    if (req.user.role === 'resident' && req.user.must_change_password && !exempt) {
      return res.status(403).json({
        success: false,
        code: 'MUST_CHANGE_PASSWORD',
        message: 'You must change your password before continuing.',
      });
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

// Check if user has required role
// Usage:
//  requireRole('union_admin', 'super_admin')
//  or
//  requireRole(['union_admin', 'super_admin'])
export const requireRole = (...roles) => {
  // Support both array and rest-args usage
  const flatRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!flatRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. Required role: ' + flatRoles.join(' or '),
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await query(
        `SELECT id, email, name, role, society_apartment_id, unit_id,
                COALESCE(must_change_password, false) AS must_change_password
         FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL`,
        [decoded.userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Allow PUT /residents/:id if user is resident updating own record (req.params.id === req.user.id),
 * otherwise require super_admin or union_admin.
 */
export const allowResidentSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const isResidentSelf = req.user.role === 'resident' && String(req.params.id) === String(req.user.id);
  if (isResidentSelf) {
    req.residentSelfUpdate = true;
    return next();
  }
  return requireRole('super_admin', 'union_admin')(req, res, next);
};
