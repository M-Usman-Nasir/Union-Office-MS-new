import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { deleteProfileImage, getImagePath } from '../config/multer.js';
import { createOrUpdateSubscription } from './subscriptionController.js';

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

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
      'SELECT id, email, password, name, role, society_apartment_id, unit_id, is_active FROM users WHERE email = $1',
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
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (without password) and access token.
    // refreshToken is also returned so mobile clients can store it and send in body for /auth/refresh (cookies not reliable in RN).
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
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
      'SELECT id FROM users WHERE email = $1',
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
      `INSERT INTO users (email, password, name, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, created_by, address, city, postal_code, work_employer, work_title, work_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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

// Get current user
export const getMe = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, role, society_apartment_id, unit_id, cnic, contact_number, 
              emergency_contact, profile_image, move_in_date, created_at, last_login
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
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
      'SELECT id FROM users WHERE id = $1 AND is_active = true',
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
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
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
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
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
