# SRS Implementation - Backend Technical Plan

## Overview
This document outlines the backend implementation plan for all SRS requirements. It includes API endpoints, controllers, middleware, scheduled jobs, and database interactions.

---

## 1. Super Admin Portal - Global Reports

### 1.1 API Endpoints

**Route:** `GET /api/super-admin/reports/global`

**Controller:** Create `backend/controllers/superAdminController.js`

**Features:**
- Aggregate data from all societies
- Cross-society analytics
- Financial summaries across all apartments
- Complaint statistics across all apartments

**Implementation:**
```javascript
// backend/controllers/superAdminController.js
import { query } from '../config/database.js';

export const getGlobalReports = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    // Aggregate financial data
    const financialSummary = await query(`
      SELECT 
        COUNT(DISTINCT f.society_apartment_id) as total_societies,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) as total_income,
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) - 
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as net_income
      FROM finance f
      WHERE f.year = $1
    `, [currentYear]);

    // Aggregate complaint statistics
    const complaintStats = await query(`
      SELECT 
        COUNT(*) as total_complaints,
        COUNT(DISTINCT society_apartment_id) as societies_with_complaints,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
      FROM complaints
    `);

    // Society-wise breakdown
    const societyBreakdown = await query(`
      SELECT 
        s.id, s.name,
        COUNT(DISTINCT u.id) as total_units,
        COUNT(DISTINCT c.id) as total_complaints,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) as income,
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as expenses
      FROM societies s
      LEFT JOIN units u ON s.id = u.society_apartment_id
      LEFT JOIN complaints c ON s.id = c.society_apartment_id
      LEFT JOIN finance f ON s.id = f.society_apartment_id AND f.year = $1
      GROUP BY s.id, s.name
    `, [currentYear]);

    res.json({
      success: true,
      data: {
        financial: financialSummary.rows[0],
        complaints: complaintStats.rows[0],
        societyBreakdown: societyBreakdown.rows
      }
    });
  } catch (error) {
    console.error('Global reports error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Route File:** Create `backend/routes/superAdmin.js`
```javascript
import express from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/global', requireRole('super_admin'), superAdminController.getGlobalReports);

export default router;
```

**Update:** `backend/server.js`
```javascript
import superAdminRoutes from './routes/superAdmin.js';
// ...
app.use('/api/super-admin', superAdminRoutes);
```

---

## 2. Admin Portal - Residents Management

### 2.1 Additional Fields

**Current Schema:** Units table already has:
- `owner_name` ✅
- `resident_name` ✅
- `license_plate` ✅

**Missing Fields to Add:**
- `telephone_bills` (JSONB for multiple bills)
- `other_bills` (JSONB for miscellaneous bills)

**Migration:** See Database plan

**API Update:** `PUT /api/residents/:id`
- Update `backend/controllers/residentController.js` to handle JSONB fields
- Add validation for new fields

---

## 3. Payments Module - Auto-Due Generation

### 3.1 Scheduled Job Implementation

**Technology:** Use `node-cron` package

**Installation:**
```bash
cd backend
npm install node-cron
```

**Implementation:** Create `backend/jobs/monthlyDuesGenerator.js`
```javascript
import cron from 'node-cron';
import { query } from '../config/database.js';

// Run on 1st of every month at 00:00
export const scheduleMonthlyDues = () => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('Starting monthly dues generation...');
      
      // Get all active units
      const activeUnits = await query(`
        SELECT u.id, u.society_apartment_id, u.block_id
        FROM units u
        WHERE u.society_apartment_id IS NOT NULL
      `);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (const unit of activeUnits.rows) {
        try {
          // Get maintenance config for society/block/unit (priority: unit > block > society)
          const config = await query(`
            SELECT base_amount 
            FROM maintenance_config 
            WHERE (
              (unit_id = $1) OR
              (block_id = $2 AND unit_id IS NULL) OR
              (society_apartment_id = $3 AND block_id IS NULL AND unit_id IS NULL)
            )
            ORDER BY 
              CASE WHEN unit_id IS NOT NULL THEN 1 
                   WHEN block_id IS NOT NULL THEN 2 
                   ELSE 3 END
            LIMIT 1
          `, [unit.id, unit.block_id, unit.society_apartment_id]);

          if (config.rows.length > 0) {
            const baseAmount = parseFloat(config.rows[0].base_amount);
            
            // Check if maintenance already exists for this month
            const existing = await query(`
              SELECT id FROM maintenance 
              WHERE unit_id = $1 AND month = $2 AND year = $3
            `, [unit.id, currentMonth, currentYear]);

            if (existing.rows.length === 0) {
              // Create new maintenance record
              const dueDate = new Date(currentYear, currentMonth, 1); // 1st of next month
              
              await query(`
                INSERT INTO maintenance 
                (unit_id, society_apartment_id, month, year, base_amount, total_amount, status, due_date)
                VALUES ($1, $2, $3, $4, $5, $5, 'pending', $6)
              `, [
                unit.id,
                unit.society_apartment_id,
                currentMonth,
                currentYear,
                baseAmount,
                dueDate
              ]);
              
              successCount++;
            }
          } else {
            errors.push(`No maintenance config found for unit ${unit.id}`);
            failCount++;
          }
        } catch (error) {
          errors.push(`Unit ${unit.id}: ${error.message}`);
          failCount++;
        }
      }

      // Log generation
      await query(`
        INSERT INTO monthly_dues_generation_log 
        (generation_date, month, year, total_units, successful_generations, failed_generations, errors)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (year, month) DO NOTHING
      `, [
        new Date(),
        currentMonth,
        currentYear,
        activeUnits.rows.length,
        successCount,
        failCount,
        errors
      ]);

      console.log(`Monthly dues generation completed: ${successCount} successful, ${failCount} failed`);
    } catch (error) {
      console.error('Error generating monthly dues:', error);
    }
  });
};
```

**Initialize in:** `backend/server.js`
```javascript
import { scheduleMonthlyDues } from './jobs/monthlyDuesGenerator.js';

// After database connection
scheduleMonthlyDues();
console.log('Monthly dues scheduler initialized');
```

### 3.2 Manual Trigger Endpoint

**Route:** `POST /api/maintenance/generate-monthly-dues`
**Controller:** `backend/controllers/maintenanceController.js`
```javascript
export const generateMonthlyDues = async (req, res) => {
  try {
    // Similar logic as scheduled job, but triggered manually
    // Only accessible by super_admin or union_admin
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // ... (same logic as scheduled job)
    
    res.json({
      success: true,
      message: 'Monthly dues generated successfully',
      data: {
        total: activeUnits.rows.length,
        successful: successCount,
        failed: failCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly dues',
      error: error.message
    });
  }
};
```

**Route:** `backend/routes/maintenance.js`
```javascript
router.post('/generate-monthly-dues', requireRole('super_admin', 'union_admin'), maintenanceController.generateMonthlyDues);
```

### 3.3 Defaulter List Visibility Toggle

**Current:** Settings table has `defaulter_list_visible` field

**API Endpoint:** `GET /api/defaulters`
**Update Controller:** `backend/controllers/defaulterController.js`
```javascript
export const getAll = async (req, res) => {
  try {
    // Check if defaulter list is visible
    if (req.user.role === 'resident') {
      const settings = await query(`
        SELECT defaulter_list_visible 
        FROM settings 
        WHERE society_apartment_id = $1
      `, [req.user.society_apartment_id]);

      if (settings.rows.length > 0 && !settings.rows[0].defaulter_list_visible) {
        return res.status(403).json({
          success: false,
          message: 'Defaulter list is not visible to residents'
        });
      }
    }
    
    // Continue with normal logic...
  } catch (error) {
    // Error handling
  }
};
```

---

## 4. Complaints Module - Staff Assignment & Progress Tracking

### 4.1 Database Changes

**New Table:** `complaint_progress` (See Database plan)

### 4.2 API Endpoints

**Assign Staff:** `PATCH /api/complaints/:id/assign`
```javascript
// backend/controllers/complaintController.js
export const assignStaff = async (req, res) => {
  try {
    const { staff_id } = req.body;
    const { id } = req.params;

    // Verify staff_id is a staff user
    const staff = await query(`
      SELECT id, role FROM users WHERE id = $1 AND role = 'staff'
    `, [staff_id]);

    if (staff.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff user'
      });
    }

    // Update complaint
    await query(`
      UPDATE complaints 
      SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [staff_id, id]);

    res.json({
      success: true,
      message: 'Staff assigned successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Add Progress Update:** `POST /api/complaints/:id/progress`
```javascript
export const addProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Insert progress entry
    await query(`
      INSERT INTO complaint_progress (complaint_id, updated_by, status, notes)
      VALUES ($1, $2, $3, $4)
    `, [id, req.user.id, status, notes]);

    // Update complaint status if provided
    if (status) {
      await query(`
        UPDATE complaints 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [status, id]);
    }

    res.json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Get Progress History:** `GET /api/complaints/:id/progress`
```javascript
export const getProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT cp.*, u.name as updated_by_name
      FROM complaint_progress cp
      LEFT JOIN users u ON cp.updated_by = u.id
      WHERE cp.complaint_id = $1
      ORDER BY cp.created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Update Routes:** `backend/routes/complaints.js`
```javascript
router.patch('/:id/assign', requireRole('super_admin', 'union_admin'), complaintController.assignStaff);
router.post('/:id/progress', requireRole('super_admin', 'union_admin', 'staff'), complaintController.addProgress);
router.get('/:id/progress', authenticate, complaintController.getProgress);
```

---

## 5. Finance Module - Income Recording & Reports

### 5.1 Income Entry

**Current:** Finance table already supports `transaction_type = 'income'`

**API Endpoint:** `POST /api/finance`
**Update Controller:** `backend/controllers/financeController.js`
```javascript
export const create = async (req, res) => {
  try {
    const {
      transaction_type,
      income_type,
      expense_type,
      amount,
      description,
      transaction_date,
      // ... other fields
    } = req.body;

    // Validate income_type when transaction_type is 'income'
    if (transaction_type === 'income' && !income_type) {
      return res.status(400).json({
        success: false,
        message: 'Income type is required for income transactions'
      });
    }

    // Validate expense_type when transaction_type is 'expense'
    if (transaction_type === 'expense' && !expense_type) {
      return res.status(400).json({
        success: false,
        message: 'Expense type is required for expense transactions'
      });
    }

    const date = new Date(transaction_date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const result = await query(`
      INSERT INTO finance (
        society_apartment_id, added_by, transaction_date, transaction_type,
        income_type, expense_type, description, amount, month, year
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      req.user.society_apartment_id,
      req.user.id,
      transaction_date,
      transaction_type,
      income_type || null,
      expense_type || null,
      description,
      amount,
      month,
      year
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### 5.2 Financial Reports

**Monthly Report:** `GET /api/finance/reports/monthly`
```javascript
export const getMonthlyReport = async (req, res) => {
  try {
    const { month, year, society_id } = req.query;
    const societyId = society_id || req.user.society_apartment_id;

    const report = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income,
        COUNT(CASE WHEN transaction_type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN transaction_type = 'expense' THEN 1 END) as expense_count
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3
    `, [month, year, societyId]);

    // Get breakdown by type
    const breakdown = await query(`
      SELECT 
        transaction_type,
        income_type,
        expense_type,
        SUM(amount) as total
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3
      GROUP BY transaction_type, income_type, expense_type
      ORDER BY transaction_type, total DESC
    `, [month, year, societyId]);

    res.json({
      success: true,
      data: {
        summary: report.rows[0],
        breakdown: breakdown.rows
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Yearly Report:** `GET /api/finance/reports/yearly`
```javascript
export const getYearlyReport = async (req, res) => {
  try {
    const { year, society_id } = req.query;
    const societyId = society_id || req.user.society_apartment_id;

    // Get monthly breakdown
    const monthlyBreakdown = await query(`
      SELECT 
        month,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2
      GROUP BY month
      ORDER BY month
    `, [year, societyId]);

    // Get yearly totals
    const yearlyTotal = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income
      FROM finance
      WHERE year = $1 AND society_apartment_id = $2
    `, [year, societyId]);

    res.json({
      success: true,
      data: {
        yearly: yearlyTotal.rows[0],
        monthly: monthlyBreakdown.rows
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Export Reports:** `GET /api/finance/reports/export`
- Use libraries: `exceljs` for Excel, `pdfkit` for PDF
- Generate file and return download link

**Routes:** `backend/routes/finance.js`
```javascript
router.get('/reports/monthly', authenticate, financeController.getMonthlyReport);
router.get('/reports/yearly', authenticate, financeController.getYearlyReport);
router.get('/reports/export', authenticate, financeController.exportReport);
```

---

## 6. Settings Module

### 6.1 API Endpoints

**Get Settings:** `GET /api/settings/:society_id`
**Update Settings:** `PUT /api/settings/:society_id`

**Controller:** Create `backend/controllers/settingsController.js`
```javascript
import { query } from '../config/database.js';

export const getSettings = async (req, res) => {
  try {
    const { society_id } = req.params;
    
    const result = await query(`
      SELECT * FROM settings WHERE society_apartment_id = $1
    `, [society_id]);

    if (result.rows.length === 0) {
      // Return default settings
      return res.json({
        success: true,
        data: {
          defaulter_list_visible: false,
          complaint_logs_visible: false,
          financial_reports_visible: false
        }
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { society_id } = req.params;
    const {
      defaulter_list_visible,
      complaint_logs_visible,
      financial_reports_visible
    } = req.body;

    await query(`
      INSERT INTO settings 
        (society_apartment_id, defaulter_list_visible, complaint_logs_visible, financial_reports_visible)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (society_apartment_id) 
      DO UPDATE SET 
        defaulter_list_visible = EXCLUDED.defaulter_list_visible,
        complaint_logs_visible = EXCLUDED.complaint_logs_visible,
        financial_reports_visible = EXCLUDED.financial_reports_visible,
        updated_at = CURRENT_TIMESTAMP
    `, [society_id, defaulter_list_visible, complaint_logs_visible, financial_reports_visible]);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Routes:** Create `backend/routes/settings.js`
```javascript
import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.use(requireRole('super_admin', 'union_admin'));

router.get('/:society_id', settingsController.getSettings);
router.put('/:society_id', settingsController.updateSettings);

export default router;
```

**Update:** `backend/server.js`
```javascript
import settingsRoutes from './routes/settings.js';
app.use('/api/settings', settingsRoutes);
```

### 6.2 Maintenance Amount Configuration

**Per-Block/Per-Flat Configuration:**
- Update `maintenance_config` table (See Database plan)
- Update API to support per-block/per-unit configuration

---

## 7. Resident Portal - Public Financial Summaries

### 7.1 API Endpoint

**Route:** `GET /api/finance/public-summary`
**Controller:** `backend/controllers/financeController.js`
```javascript
export const getPublicSummary = async (req, res) => {
  try {
    // Check if financial_reports_visible is true
    const settings = await query(`
      SELECT financial_reports_visible 
      FROM settings 
      WHERE society_apartment_id = $1
    `, [req.user.society_apartment_id]);

    if (!settings.rows[0]?.financial_reports_visible) {
      return res.status(403).json({
        success: false,
        message: 'Financial reports are not visible to residents'
      });
    }

    const { month, year } = req.query;
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();

    // Return summary data
    const summary = await query(`
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as net_income
      FROM finance
      WHERE month = $1 AND year = $2 AND society_apartment_id = $3
    `, [currentMonth, currentYear, req.user.society_apartment_id]);

    res.json({
      success: true,
      data: summary.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Route:** `backend/routes/finance.js`
```javascript
router.get('/public-summary', authenticate, financeController.getPublicSummary);
```

---

## 8. Staff Portal

### 8.1 Authentication

**Current:** Users table already supports `role = 'staff'`

**No changes needed** - Staff can use existing login endpoint

### 8.2 Staff Complaint Management

**Controller:** Create `backend/controllers/staffController.js`
```javascript
import { query } from '../config/database.js';

export const getStaffComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*, u.unit_number, s.name as society_name
      FROM complaints c
      LEFT JOIN units u ON c.unit_id = u.id
      LEFT JOIN societies s ON c.society_apartment_id = s.id
      WHERE c.assigned_to = $1
    `;
    const params = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      sql += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM complaints WHERE assigned_to = $1';
    const countParams = [req.user.id];
    if (status) {
      countSql += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await query(countSql, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### 8.3 Staff Payment Updates

**Controller:** `backend/controllers/staffController.js`
```javascript
export const getPayments = async (req, res) => {
  try {
    // Get payments for staff's assigned society
    const result = await query(`
      SELECT m.*, u.unit_number, s.name as society_name
      FROM maintenance m
      LEFT JOIN units u ON m.unit_id = u.id
      LEFT JOIN societies s ON m.society_apartment_id = s.id
      WHERE m.society_apartment_id = $1
      ORDER BY m.created_at DESC
    `, [req.user.society_apartment_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount_paid } = req.body;

    // Get current payment record
    const current = await query(`
      SELECT status, amount_paid FROM maintenance WHERE id = $1
    `, [id]);

    if (current.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    const previousStatus = current.rows[0].status;
    const previousAmount = parseFloat(current.rows[0].amount_paid) || 0;
    const newAmount = parseFloat(amount_paid) || previousAmount;

    // Update payment status (limited - can only update status, not base amount)
    await query(`
      UPDATE maintenance 
      SET status = $1, amount_paid = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [status, newAmount, id]);

    // Log in payment_history
    await query(`
      INSERT INTO payment_history 
        (maintenance_id, updated_by, previous_status, new_status, 
         previous_amount_paid, new_amount_paid, amount_change)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      id,
      req.user.id,
      previousStatus,
      status,
      previousAmount,
      newAmount,
      newAmount - previousAmount
    ]);

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Routes:** Create `backend/routes/staff.js`
```javascript
import express from 'express';
import * as staffController from '../controllers/staffController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.use(requireRole('staff'));

router.get('/complaints', staffController.getStaffComplaints);
router.get('/payments', staffController.getPayments);
router.patch('/payments/:id', staffController.updatePaymentStatus);

export default router;
```

**Update:** `backend/server.js`
```javascript
import staffRoutes from './routes/staff.js';
app.use('/api/staff', staffRoutes);
```

---

## 9. Additional Requirements

### 9.1 Complaint Visibility for Residents

**Update:** `GET /api/complaints`
**Controller:** `backend/controllers/complaintController.js`
```javascript
// In getAll function, update resident filter:
if (req.user.role === 'resident') {
  paramCount++;
  sql += ` AND (c.submitted_by = $${paramCount} OR c.is_public = true)`;
  params.push(req.user.id);
}
```

---

## 10. Dependencies to Install

```bash
cd backend
npm install node-cron exceljs pdfkit
```

---

## 11. Implementation Priority

1. **HIGH PRIORITY:**
   - Auto-due generation (scheduled job)
   - Income recording in finance module
   - Staff portal authentication & routes
   - Complaint staff assignment

2. **MEDIUM PRIORITY:**
   - Financial reports (monthly/yearly)
   - Global reports for super admin
   - Settings visibility toggles verification

3. **LOW PRIORITY:**
   - Report export (PDF/Excel)
   - Payment history tracking
   - Per-block/flat maintenance config

---

## 12. Testing Checklist

- [ ] Auto-due generation runs on 1st of month
- [ ] Manual trigger works for monthly dues
- [ ] Staff can login and access staff routes
- [ ] Staff can update complaint progress
- [ ] Staff can update payment status (limited)
- [ ] Income entries are saved correctly
- [ ] Financial reports return correct data
- [ ] Visibility toggles control access
- [ ] Global reports aggregate correctly
- [ ] Residents can see public complaints
- [ ] Settings are saved and retrieved correctly
