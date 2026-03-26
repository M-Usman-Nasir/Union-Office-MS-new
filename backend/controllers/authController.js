import crypto from 'crypto';
import process from 'node:process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { deleteProfileImage, getImagePath } from '../config/multer.js';
import { createOrUpdateSubscription } from './subscriptionController.js';
import { RESIDENT_INITIAL_PASSWORD } from '../utils/unitResidentLogin.js';
import { sendEmail } from '../services/emailService.js';

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Cross-domain cookie options for refresh token:
// - Production default: SameSite=None + Secure=true (required for different frontend/backend domains)
// - Development default: SameSite=Lax + Secure=false
const getRefreshCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || '').trim().toLowerCase();
  const secureEnv = (process.env.COOKIE_SECURE || '').trim().toLowerCase();

  const sameSite =
    sameSiteEnv === 'strict' || sameSiteEnv === 'lax' || sameSiteEnv === 'none'
      ? sameSiteEnv
      : (isProd ? 'none' : 'lax');

  const secure =
    secureEnv === 'true' ? true
      : secureEnv === 'false' ? false
      : isProd;

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

/**
 * User row for API responses with unit / block / apartment (society) labels for mobile & web.
 */
async function loadUserProfileWithLocation(userId) {
  const result = await query(
    `SELECT
       u.id,
       u.email,
       u.name,
       u.role,
       u.society_apartment_id,
       u.unit_id,
       u.cnic,
       u.contact_number,
       u.emergency_contact,
       u.profile_image,
       u.move_in_date,
       u.created_at,
       u.last_login,
       COALESCE(u.must_change_password, false) AS must_change_password,
       un.unit_number,
       b.name AS block_name,
       ap.name AS apartment_name
     FROM users u
     LEFT JOIN units un ON u.unit_id = un.id
     LEFT JOIN blocks b ON un.block_id = b.id
     LEFT JOIN apartments ap ON ap.id = COALESCE(un.society_apartment_id, u.society_apartment_id)
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const result = await query(
      `SELECT id, email, password, name, role, society_apartment_id, unit_id, is_active,
              COALESCE(must_change_password, false) AS must_change_password
       FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Staff with placeholder email are record-only and cannot login
    if ((user.email || '').endsWith('@no-login.local')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password) || password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Union Admin: allow login only if subscription exists and is active (super admin must activate first)
    // and apartment is approved (formal approve workflow)
    if (user.role === 'union_admin') {
      const subResult = await query(
        'SELECT status FROM subscriptions WHERE user_id = $1',
        [user.id]
      );
      if (subResult.rows.length === 0 || (subResult.rows[0].status || '').toLowerCase() !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account not activated. Please contact the administrator.',
        });
      }
      if (user.society_apartment_id) {
        const aptResult = await query(
          'SELECT approval_status FROM apartments WHERE id = $1',
          [user.society_apartment_id]
        );
        if (aptResult.rows.length > 0 && (aptResult.rows[0].approval_status || '').toLowerCase() !== 'approved') {
          return res.status(401).json({
            success: false,
            message: 'Union is pending approval. Please contact the platform administrator.',
          });
        }
      }
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    // Return user data (without password) and access token.
    // refreshToken is also returned so mobile clients can store it and send in body for /auth/refresh (cookies not reliable in RN).
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    let userForClient = userWithoutPassword;
    try {
      const enriched = await loadUserProfileWithLocation(user.id);
      if (enriched) {
        userForClient = { ...enriched, is_active: userWithoutPassword.is_active };
      }
    } catch (e) {
      console.warn('Login: could not enrich user with location', e.message);
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userForClient,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Register (for super admin to create users)
export const register = async (req, res) => {
  try {
    let { email, password, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, plan_id, subscription_status, address, city, postal_code, work_employer, work_title, work_phone, department, designation, salary_rupees } = req.body;

    // Name and role always required
    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name and role are required',
      });
    }
    // Email required except for staff created by union_admin (record-only, no login)
    const staffNoLogin = role === 'staff' && req.user?.role === 'union_admin';
    if (!staffNoLogin && (!email || !email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    // Password required unless super_admin lead flow or staff (record-only)
    const passwordOptional = (req.user?.role === 'super_admin' && society_apartment_id) || staffNoLogin;
    if (!password || (typeof password === 'string' && !password.trim())) {
      if (!passwordOptional) {
        return res.status(400).json({
          success: false,
          message: 'Password is required',
        });
      }
      password = crypto.randomBytes(24).toString('hex');
    }

    // Staff created by union_admin: use placeholder email so they cannot login
    if (staffNoLogin && (!email || !email.trim())) {
      email = `staff-${society_apartment_id || 0}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}@no-login.local`;
    }

    // Only one Super Admin exists; creating another is not allowed
    if (role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Creating a new Super Admin is not allowed. There is only one Super Admin in the system.',
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // One Union Admin per apartment: no other union_admin can have this society_apartment_id
    if (role === 'union_admin' && society_apartment_id) {
      const existingAdmin = await query(
        'SELECT id FROM users WHERE role = $1 AND society_apartment_id = $2',
        ['union_admin', society_apartment_id]
      );
      if (existingAdmin.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'This apartment already has an admin. Each apartment can have only one Union Admin.',
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, created_by, address, city, postal_code, work_employer, work_title, work_phone, must_change_password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, false)
       RETURNING id, email, name, role, society_apartment_id, unit_id, created_at`,
      [
        email.toLowerCase(),
        hashedPassword,
        name,
        role,
        society_apartment_id || null,
        unit_id || null,
        cnic || null,
        contact_number || null,
        emergency_contact || null,
        req.user?.id || null,
        address || null,
        city || null,
        postal_code || null,
        work_employer || null,
        work_title || null,
        work_phone || null,
      ]
    );

    const newUser = result.rows[0];

    // When union_admin creates staff, insert into employees (wired to society_apartment_id and created_by)
    if (role === 'staff' && req.user?.role === 'union_admin' && req.user?.id) {
      const empSocietyId = society_apartment_id || req.user.society_apartment_id;
      if (empSocietyId) {
        await query(
          `INSERT INTO employees (user_id, society_apartment_id, created_by, department, designation, salary_rupees)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            newUser.id,
            empSocietyId,
            req.user.id,
            department || null,
            designation || work_title || null,
            salary_rupees != null && salary_rupees !== '' ? parseFloat(salary_rupees) : null,
          ]
        );
      }
    }

    // Create subscription only when NOT adding from lead (lead flow uses Create Job dialog to assign plan later)
    if (role === 'union_admin' && society_apartment_id && subscription_status !== 'pending') {
      try {
        await createOrUpdateSubscription(newUser.id, society_apartment_id, plan_id || null, 'active');
      } catch (subErr) {
        console.warn('Subscription create skipped (table may not exist yet):', subErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Public resident self-registration (no auth). User is created with no society/apartment; they can log in but must be assigned by admin to use app features.
export const registerResident = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users (email, password, name, role, is_active, society_apartment_id, unit_id, created_by, must_change_password)
       VALUES ($1, $2, $3, $4, $5, NULL, NULL, NULL, false)`,
      [normalizedEmail, hashedPassword, name.trim(), 'resident', true]
    );

    res.status(201).json({
      success: true,
      message: 'Account created. You can sign in now. You will need to be added to a society by an admin to use the app.',
    });
  } catch (error) {
    console.error('Register resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/** First login after unit-based initial password */
export const changePasswordFirstLogin = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }
    if (new_password === RESIDENT_INITIAL_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'Choose a different password than the initial default.',
      });
    }

    const row = await query(
      `SELECT id, password, COALESCE(must_change_password, false) AS must_change_password, role
       FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL`,
      [req.user.id]
    );
    if (!row.rows.length) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const u = row.rows[0];
    if (!u.must_change_password) {
      return res.status(400).json({
        success: false,
        message: 'Password change is not required for this account.',
      });
    }

    const ok =
      (await bcrypt.compare(current_password, u.password)) ||
      current_password === u.password;
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await query(
      `UPDATE users SET password = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashed, u.id]
    );

    const { accessToken, refreshToken } = generateTokens(u.id);
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    const fresh = await query(
      `SELECT id, email, name, role, society_apartment_id, unit_id, cnic, contact_number,
              emergency_contact, profile_image, move_in_date, created_at, last_login,
              false AS must_change_password
       FROM users WHERE id = $1`,
      [u.id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully',
      data: {
        user: fresh.rows[0],
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('changePasswordFirstLogin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    });
  }
};

/** Authenticated user password change */
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const row = await query(
      `SELECT id, password FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL`,
      [req.user.id]
    );
    if (!row.rows.length) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const u = row.rows[0];

    const ok =
      (await bcrypt.compare(current_password, u.password)) ||
      current_password === u.password;
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const sameAsOld = await bcrypt.compare(new_password, u.password);
    if (sameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await query(
      `UPDATE users SET password = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashed, u.id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    });
  }
};

/**
 * Public forgot password request.
 * Sends a reset link if account exists; always returns success to avoid account enumeration.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userResult = await query(
      `SELECT id, email, password, is_active
       FROM users
       WHERE email = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [normalizedEmail]
    );

    if (userResult.rows.length > 0) {
      const u = userResult.rows[0];
      if (u.is_active) {
        const resetSecret = `${process.env.JWT_SECRET}:${u.password}`;
        const token = jwt.sign(
          { userId: u.id, email: u.email, type: 'password_reset' },
          resetSecret,
          { expiresIn: '15m' }
        );

        const clientBaseUrl = (process.env.CORS_ORIGIN || 'http://localhost:5173').replace(/\/$/, '');
        const resetUrl = `${clientBaseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(u.email)}`;

        await sendEmail({
          to: u.email,
          subject: 'Reset your password',
          text: `We received a request to reset your password.\n\nUse this link to set a new password (valid for 15 minutes):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
          html: `
            <p>We received a request to reset your password.</p>
            <p><a href="${resetUrl}">Reset your password</a> (valid for 15 minutes)</p>
            <p>If you did not request this, you can ignore this email.</p>
          `,
        });
      }
    }

    return res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('forgotPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message,
    });
  }
};

/**
 * Public password reset using token from forgot password email.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, email, new_password } = req.body;

    if (!token || !email || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Token, email, and new password are required',
      });
    }
    if (String(new_password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userResult = await query(
      `SELECT id, email, password
       FROM users
       WHERE email = $1 AND is_active = true AND deleted_at IS NULL
       LIMIT 1`,
      [normalizedEmail]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link',
      });
    }

    const u = userResult.rows[0];
    const resetSecret = `${process.env.JWT_SECRET}:${u.password}`;

    let decoded;
    try {
      decoded = jwt.verify(token, resetSecret);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link',
      });
    }

    if (decoded.type !== 'password_reset' || decoded.userId !== u.id || decoded.email !== u.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link',
      });
    }

    const sameAsOld = await bcrypt.compare(new_password, u.password);
    if (sameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await query(
      `UPDATE users
       SET password = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashed, u.id]
    );

    return res.json({
      success: true,
      message: 'Password reset successful. Please sign in with your new password.',
    });
  } catch (error) {
    console.error('resetPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

/**
 * Protected endpoint to verify SMTP setup.
 * Sends a test email to provided address, or falls back to logged-in user's email.
 */
export const sendTestEmail = async (req, res) => {
  try {
    const bodyEmail = typeof req.body?.to === 'string' ? req.body.to.trim().toLowerCase() : '';
    const recipient = bodyEmail || req.user?.email;

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required',
      });
    }

    const subject = 'SMTP test email - Homeland Union';
    const text = `SMTP is configured correctly.\n\nSent at: ${new Date().toISOString()}\nRequested by: ${req.user?.email || 'unknown'}`;
    const html = `
      <p><strong>SMTP is configured correctly.</strong></p>
      <p>Sent at: ${new Date().toISOString()}</p>
      <p>Requested by: ${req.user?.email || 'unknown'}</p>
    `;

    const sent = await sendEmail({
      to: recipient,
      subject,
      text,
      html,
    });

    if (!sent) {
      return res.status(503).json({
        success: false,
        message: 'Email transport is not configured or sending failed',
      });
    }

    return res.json({
      success: true,
      message: `Test email sent to ${recipient}`,
    });
  } catch (error) {
    console.error('sendTestEmail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const row = await loadUserProfileWithLocation(req.user.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
      error: error.message,
    });
  }
};

// Update current user's profile
// Allows the logged-in user (resident, staff, admin, super admin) to update basic profile fields.
// Fields: name, contact_number, emergency_contact, cnic, profile_image (file upload)
export const updateMe = async (req, res) => {
  try {
    const { name, contact_number, emergency_contact, cnic } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Handle profile image file upload
    let profileImagePath = null;
    
    // Get current user's profile image before update
    const currentUserResult = await query(
      'SELECT profile_image FROM users WHERE id = $1',
      [req.user.id]
    );
    const currentProfileImage = currentUserResult.rows[0]?.profile_image;

    // If a new image file was uploaded
    if (req.file) {
      profileImagePath = getImagePath(req.file.filename);
      
      // Delete old profile image if it exists (and it's not base64)
      if (currentProfileImage && !currentProfileImage.startsWith('data:image/')) {
        deleteProfileImage(currentProfileImage);
      }
    } else if (req.body.remove_image === 'true') {
      // Handle explicit image removal
      if (currentProfileImage && !currentProfileImage.startsWith('data:image/')) {
        deleteProfileImage(currentProfileImage);
      }
      profileImagePath = null;
    } else {
      // Keep existing image (don't update profile_image column)
      profileImagePath = undefined; // undefined means don't update this field
    }

    // Build update query dynamically
    const updateFields = ['name = $1'];
    const updateValues = [name];
    let paramIndex = 2;

    if (profileImagePath !== undefined) {
      updateFields.push(`profile_image = $${paramIndex}`);
      updateValues.push(profileImagePath);
      paramIndex++;
    }

    if (contact_number !== undefined) {
      updateFields.push(`contact_number = $${paramIndex}`);
      updateValues.push(contact_number || null);
      paramIndex++;
    }

    if (emergency_contact !== undefined) {
      updateFields.push(`emergency_contact = $${paramIndex}`);
      updateValues.push(emergency_contact || null);
      paramIndex++;
    }

    if (cnic !== undefined) {
      updateFields.push(`cnic = $${paramIndex}`);
      updateValues.push(cnic || null);
      paramIndex++;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(req.user.id);

    const result = await query(
      `UPDATE users
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, profile_image, move_in_date, created_at, last_login`,
      updateValues
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update me error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const { deleteProfileImage } = await import('../config/multer.js');
      deleteProfileImage(getImagePath(req.file.filename));
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if user exists and is active
    const result = await query(
      'SELECT id FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // Clear refresh token cookie using same attributes used when setting it
    const cookieOptions = getRefreshCookieOptions();
    res.clearCookie('refreshToken', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};