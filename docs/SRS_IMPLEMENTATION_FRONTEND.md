# SRS Implementation - Frontend Technical Plan

## Overview
This document outlines the frontend implementation plan for all SRS requirements. Each feature includes checkboxes to track implementation progress.

**Last Updated:** 2026-01-26  
**Status:** Implementation In Progress

---

## Implementation Progress Summary

- **Total Features:** 45
- **Completed:** 18
- **In Progress:** 0
- **Pending:** 27

---

## 1. Super Admin Portal

### 1.1 Global Reports Dashboard

#### 1.1.1 Global Reports Page
- [ ] **Create:** `src/pages/super-admin/GlobalReports.jsx`
  - **Priority:** 🟡 Medium
  - **Description:** Cross-society analytics dashboard
  - **Features:**
    - [ ] Financial summaries across all apartments
    - [ ] Complaint statistics visualization
    - [ ] Society-wise breakdown charts
    - [ ] Year filter dropdown
    - [ ] Export functionality (future)
  - **API Integration:**
    - [ ] `GET /api/super-admin/reports/global`
  - **Components:**
    - [ ] Use existing `BarChart`, `PieChart` components
    - [ ] Create summary cards for key metrics
  - **Dependencies:** Backend API endpoint

#### 1.1.2 Route Configuration
- [ ] **Update:** `src/routes/index.jsx`
  - Add route: `/super-admin/reports`
  - Protected route for `super_admin` role

#### 1.1.3 API Service
- [x] **Create:** `src/api/superAdminApi.js`
  - `getGlobalReports(year)` function
  - Add to `src/api/index.js` exports

#### 1.1.4 Constants
- [x] **Update:** `src/utils/constants.js`
  - Add `SUPER_ADMIN_REPORTS: '/super-admin/reports'` to ROUTES
  - Add `SUPER_ADMIN_REPORTS_GLOBAL: '/super-admin/reports/global'` to API_ENDPOINTS

---

## 2. Admin Portal

### 2.1 Residents Management

#### 2.1.1 Additional Fields in Residents Form
- [ ] **Update:** `src/pages/admin/Residents.jsx`
  - **Priority:** 🟡 Medium
  - **Fields to Add/Verify:**
    - [ ] Verify `owner_name` is separate from `resident_name` (already exists ✅)
    - [ ] Verify `license_plate` field exists (already exists ✅)
    - [ ] Add `telephone_bills` field (JSONB array input)
    - [ ] Add `other_bills` field (JSONB array input)
  - **Form Updates:**
    - [ ] Add dynamic array input for telephone bills
    - [ ] Add dynamic array input for other bills
    - [ ] Add validation for new fields
  - **API Integration:**
    - [ ] Update `residentApi.create()` to handle JSONB fields
    - [ ] Update `residentApi.update()` to handle JSONB fields

#### 2.1.2 Telephone Bills Component
- [ ] **Create:** `src/components/residents/TelephoneBillsInput.jsx` (Optional)
  - Dynamic array input component
  - Add/Remove bill entries
  - Each entry: provider, account number, amount

#### 2.1.3 Other Bills Component
- [ ] **Create:** `src/components/residents/OtherBillsInput.jsx` (Optional)
  - Dynamic array input component
  - Add/Remove bill entries
  - Each entry: type, provider, amount

---

### 2.2 Payments Module (Maintenance)

#### 2.2.1 Auto-Due Generation Button
- [x] **Update:** `src/pages/admin/Maintenance.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Add "Generate Monthly Dues" button in header
    - [x] Show confirmation dialog before generation
    - [x] Display loading state during generation
    - [x] Show success/error toast notifications
    - [x] Refresh data after successful generation
  - **API Integration:**
    - [x] `POST /api/maintenance/generate-monthly-dues`
  - **UI:**
    - [x] Button with icon (CalendarToday)
    - [x] Confirmation dialog with month/year info
    - [x] Progress indicator

#### 2.2.2 API Service Update
- [x] **Update:** `src/api/maintenanceApi.js`
  - Add `generateMonthlyDues()` function
  - Handle success/error responses

#### 2.2.3 Defaulter List Visibility Check
- [ ] **Update:** `src/pages/admin/Defaulters.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Check settings before displaying data
    - [ ] Show message if visibility is disabled
    - [ ] Respect `defaulter_list_visible` setting
  - **API Integration:**
    - [ ] Check settings API before fetching defaulters
    - [ ] Handle 403 response gracefully

---

### 2.3 Complaints Module

#### 2.3.1 Staff Assignment Feature
- [x] **Update:** `src/pages/admin/Complaints.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Add staff selection dropdown in complaint view dialog
    - [x] Display assigned staff in complaint list/view
    - [x] Filter complaints by assigned staff (via API)
    - [x] Assign/Reassign staff functionality
  - **Form Updates:**
    - [x] Add `assigned_to` field (Autocomplete with staff users)
    - [x] Fetch staff list from API
    - [x] Display assigned staff name in table
  - **API Integration:**
    - [x] `PATCH /api/complaints/:id/assign`
    - [x] `GET /api/users?role=staff` for staff list

#### 2.3.2 Progress Tracking Component
- [ ] **Create:** `src/components/complaints/ProgressTimeline.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [ ] Display progress history timeline
    - [ ] Show status changes with timestamps
    - [ ] Display staff member who made update
    - [ ] Show notes for each update
  - **UI:**
    - [ ] Use MUI Timeline component
    - [ ] Color-coded status indicators
    - [ ] Expandable/collapsible notes

#### 2.3.3 Add Progress Update Dialog
- [x] **Create:** `src/components/complaints/AddProgressDialog.jsx` (Integrated in Complaints.jsx)
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Status dropdown (pending, in_progress, resolved, closed)
    - [x] Notes textarea
    - [x] Submit button
    - [x] Validation
  - **API Integration:**
    - [x] `POST /api/complaints/:id/progress`

#### 2.3.4 Complaint Detail View with Progress
- [x] **Update:** `src/pages/admin/Complaints.jsx`
  - **Features:**
    - [x] Add "View" button in actions (shows progress in dialog)
    - [x] Display progress history in view dialog
    - [x] Add "Update Progress" button (for admin/staff)
    - [x] Show assigned staff information

#### 2.3.5 API Service Updates
- [x] **Update:** `src/api/complaintApi.js`
  - Add `assignStaff(complaintId, staffId)`
  - Add `addProgress(complaintId, data)`
  - Add `getProgress(complaintId)`

#### 2.3.6 Constants Update
- [x] **Update:** `src/utils/constants.js`
  - Add `COMPLAINT_ASSIGN: (id) => /complaints/${id}/assign`
  - Add `COMPLAINT_PROGRESS: (id) => /complaints/${id}/progress`

---

### 2.4 Finance Module

#### 2.4.1 Income Entry Form
- [x] **Update:** `src/pages/admin/Finance.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Income entry form (integrated in existing dialog)
    - [x] Income type dropdown (fines, additional_charges, other_income)
    - [x] Date picker
    - [x] Amount input
    - [x] Description field
    - [x] Payment mode dropdown
  - **Form Fields:**
    - [x] Transaction type: "income" (selectable)
    - [x] Income type: dropdown (with constants)
    - [x] Transaction date: DatePicker
    - [x] Amount: number input
    - [x] Description: textarea
    - [x] Payment mode: dropdown
  - **Validation:**
    - [x] Income type required when transaction_type is income
    - [x] Amount must be > 0

#### 2.4.2 Finance Tabs Component
- [ ] **Update:** `src/pages/admin/Finance.jsx`
  - **Features:**
    - [ ] Add Tabs component (Expenses, Income, Reports)
    - [ ] Tab 1: Expenses (existing)
    - [ ] Tab 2: Income (new)
    - [ ] Tab 3: Reports (new)

#### 2.4.3 Financial Reports Component
- [ ] **Create:** `src/components/finance/FinancialReports.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Monthly report view
    - [ ] Yearly report view
    - [ ] Month/Year selector
    - [ ] Summary cards (Total Income, Total Expenses, Net Income)
    - [ ] Breakdown charts (by income/expense type)
    - [ ] Export buttons (PDF/Excel) - future
  - **Charts:**
    - [ ] Monthly trend chart (line chart)
    - [ ] Income vs Expense comparison (bar chart)
    - [ ] Category breakdown (pie chart)
  - **API Integration:**
    - [ ] `GET /api/finance/reports/monthly?month=X&year=Y`
    - [ ] `GET /api/finance/reports/yearly?year=Y`

#### 2.4.4 Finance Summary Update
- [ ] **Update:** `src/pages/admin/Finance.jsx` summary section
  - **Features:**
    - [ ] Include income in summary calculations
    - [ ] Show net income (income - expenses)
    - [ ] Update summary cards to show income separately

#### 2.4.5 API Service Updates
- [x] **Update:** `src/api/financeApi.js` (Partially - create() already handles income_type)
  - [ ] Add `getMonthlyReport(month, year)` (Phase 2)
  - [ ] Add `getYearlyReport(year)` (Phase 2)
  - [ ] Add `exportReport(params)` (future)
  - [x] Update `create()` to handle income_type (already works)

#### 2.4.6 Constants Update
- [x] **Update:** `src/utils/constants.js`
  - [x] Add income types constant:
    ```javascript
    INCOME_TYPES: {
      FINES: 'fines',
      ADDITIONAL_CHARGES: 'additional_charges',
      OTHER_INCOME: 'other_income'
    }
    ```
  - [x] Add API endpoints:
    - [x] `FINANCE_REPORTS_MONTHLY: '/finance/reports/monthly'`
    - [x] `FINANCE_REPORTS_YEARLY: '/finance/reports/yearly'`

---

### 2.5 Settings Module

#### 2.5.1 Visibility Toggles Implementation
- [ ] **Update:** `src/pages/admin/Settings.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Connect toggles to backend API
    - [ ] Save settings on toggle change
    - [ ] Show loading state during save
    - [ ] Display success/error messages
    - [ ] Verify toggles actually control access
  - **Toggles:**
    - [ ] Defaulter List Visible
    - [ ] Complaint Logs Visible
    - [ ] Financial Reports Visible
  - **API Integration:**
    - [ ] `GET /api/settings/:society_id`
    - [ ] `PUT /api/settings/:society_id`

#### 2.5.2 Settings API Service
- [ ] **Create:** `src/api/settingsApi.js`
  - `getSettings(societyId)`
  - `updateSettings(societyId, data)`
  - Add to `src/api/index.js` exports

#### 2.5.3 Maintenance Amount Configuration
- [ ] **Update:** `src/pages/admin/Settings.jsx`
  - **Priority:** 🟢 Low
  - **Features:**
    - [ ] Add maintenance amount configuration section
    - [ ] Support per-society configuration
    - [ ] Support per-block configuration (future)
    - [ ] Support per-unit configuration (future)
  - **UI:**
    - [ ] Form with society selector
    - [ ] Block selector (optional)
    - [ ] Unit selector (optional)
    - [ ] Base amount input
    - [ ] Save button

---

## 3. Resident Portal

### 3.1 Public Financial Summaries

#### 3.1.1 Financial Summary Page
- [ ] **Create:** `src/pages/resident/FinancialSummary.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Check visibility setting before displaying
    - [ ] Show message if not visible
    - [ ] Display income, expenses, net income
    - [ ] Monthly summary cards
    - [ ] Yearly summary (if enabled)
    - [ ] Simple charts (if data available)
  - **Visibility Check:**
    - [ ] Check `financial_reports_visible` setting
    - [ ] Show appropriate message if disabled
  - **API Integration:**
    - [ ] `GET /api/finance/public-summary?month=X&year=Y`
    - [ ] Handle 403 response gracefully

#### 3.1.2 Route Configuration
- [ ] **Update:** `src/routes/index.jsx`
  - Add route: `/resident/financial-summary`
  - Protected route for `resident` role

#### 3.1.3 Navigation Update
- [ ] **Update:** `src/components/layout/MainLayout.jsx`
  - Add "Financial Summary" menu item for residents
  - Show only if visibility is enabled

#### 3.1.4 Constants Update
- [ ] **Update:** `src/utils/constants.js`
  - Add `RESIDENT_FINANCIAL_SUMMARY: '/resident/financial-summary'` to ROUTES
  - Add `FINANCE_PUBLIC_SUMMARY: '/finance/public-summary'` to API_ENDPOINTS

---

### 3.2 Complaint Visibility

#### 3.2.1 Public Complaints View
- [ ] **Update:** `src/pages/resident/Complaints.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Show own complaints + public complaints
    - [ ] Filter to show "My Complaints" vs "Public Complaints"
    - [ ] Respect `complaint_logs_visible` setting
    - [ ] Display public complaints list
  - **API Integration:**
    - [ ] Backend should filter to show public + own complaints
    - [ ] Verify API returns public complaints

---

### 3.3 Defaulter List Visibility

#### 3.3.1 Visibility Check Implementation
- [ ] **Update:** `src/pages/resident/Dashboard.jsx` (if defaulter list shown)
  - **Features:**
    - [ ] Check `defaulter_list_visible` setting
    - [ ] Hide defaulter section if not visible
    - [ ] Show message if visibility is disabled

---

## 4. Staff Portal (NEW)

### 4.1 Authentication & Routes

#### 4.1.1 Staff Role Support
- [x] **Update:** `src/utils/constants.js`
  - **Priority:** 🔴 High
  - [x] Add `STAFF: 'staff'` to ROLES
  - [x] Add staff routes to ROUTES:
    - [x] `STAFF_DASHBOARD: '/staff/dashboard'`
    - [x] `STAFF_COMPLAINTS: '/staff/complaints'`
    - [x] `STAFF_PAYMENTS: '/staff/payments'`

#### 4.1.2 Login Page Update
- [x] **Update:** `src/pages/auth/LoginPage.jsx`
  - **Features:**
    - [x] Verify staff can login (should already work)
    - [ ] Add staff test user card (optional - can add later)
    - [x] Redirect staff to `/staff/dashboard` after login (handled by ProtectedRoute)

#### 4.1.3 Route Configuration
- [x] **Update:** `src/routes/index.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Add staff routes section
    - [x] Protected routes for `staff` role
    - [x] Routes:
      - [x] `/staff/dashboard`
      - [x] `/staff/complaints`
      - [x] `/staff/payments`

#### 4.1.4 Protected Route Update
- [x] **Update:** `src/routes/ProtectedRoute.jsx`
  - **Features:**
    - [x] Verify staff role is handled
    - [x] Allow staff role access

---

### 4.2 Staff Dashboard

#### 4.2.1 Staff Dashboard Page
- [ ] **Create:** `src/pages/staff/Dashboard.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [ ] Welcome message with staff name
    - [ ] Summary cards:
      - [ ] Assigned Complaints count
      - [ ] Pending Complaints count
      - [ ] Resolved Complaints count
      - [ ] Payments to Update count
    - [ ] Recent assigned complaints list
    - [ ] Quick actions section
  - **API Integration:**
    - [ ] `GET /api/staff/complaints?limit=5`
    - [ ] Aggregate statistics from complaints API

---

### 4.3 Staff Complaint Management

#### 4.3.1 Staff Complaints Page
- [x] **Create:** `src/pages/staff/Complaints.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] List all complaints assigned to current staff
    - [x] Filter by status (pending, in_progress, resolved)
    - [x] Search functionality
    - [x] View complaint details
    - [x] Update progress button
    - [x] Add progress notes
    - [x] Update status
  - **Table Columns:**
    - [x] Title
    - [x] Unit Number
    - [x] Status
    - [x] Priority
    - [x] Created Date
    - [x] Actions (View, Update Progress)
  - **API Integration:**
    - [x] `GET /api/staff/complaints`
    - [x] `POST /api/complaints/:id/progress`
    - [x] `GET /api/complaints/:id/progress`

#### 4.3.2 Update Progress Dialog
- [x] **Reuse:** `src/components/complaints/AddProgressDialog.jsx` (Integrated in Staff Complaints page)
  - Use same component as admin
  - Ensure staff can access it

---

### 4.4 Staff Payment Updates

#### 4.4.1 Staff Payments Page
- [x] **Create:** `src/pages/staff/Payments.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] List maintenance records for staff's society
    - [x] Filter by status
    - [x] Search by unit number
    - [x] Update payment status (limited)
    - [x] Update amount paid
    - [ ] View payment history (backend needed)
  - **Table Columns:**
    - [x] Unit Number
    - [x] Month/Year
    - [x] Total Amount
    - [x] Amount Paid
    - [x] Status
    - [x] Due Date
    - [x] Actions (Update Status)
  - **Update Dialog:**
    - [x] Status dropdown (pending, paid, partially_paid)
    - [x] Amount paid input
    - [ ] Notes field (optional - can add later)
    - [x] Save button
  - **API Integration:**
    - [x] `GET /api/staff/payments`
    - [x] `PATCH /api/staff/payments/:id`

#### 4.4.2 Payment Update Dialog
- [x] **Create:** `src/components/payments/UpdatePaymentDialog.jsx` (Integrated in Staff Payments page)
  - **Features:**
    - [x] Status dropdown
    - [x] Amount paid input
    - [ ] Notes textarea (optional)
    - [x] Validation
    - [x] Submit handler

---

### 4.5 Staff API Services

#### 4.5.1 Staff API Service
- [x] **Create:** `src/api/staffApi.js`
  - **Priority:** 🔴 High
  - **Functions:**
    - [x] `getComplaints(params)`
    - [x] `getPayments(params)`
    - [x] `updatePaymentStatus(paymentId, data)`
  - **Add to:** `src/api/index.js` exports (if index.js exists)

#### 4.5.2 Constants Update
- [x] **Update:** `src/utils/constants.js`
  - [x] Add API endpoints:
    - [x] `STAFF_COMPLAINTS: '/staff/complaints'`
    - [x] `STAFF_PAYMENTS: '/staff/payments'`
    - [x] `STAFF_PAYMENT_UPDATE: (id) => /staff/payments/${id}`

---

### 4.6 Staff Navigation

#### 4.6.1 Staff Menu Items
- [x] **Update:** `src/components/layout/MainLayout.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [x] Add staff menu section
    - [x] Menu items:
      - [x] Dashboard
      - [x] My Complaints
      - [x] Payment Updates
    - [x] Show only for staff role

---

## 5. Shared Components

### 5.1 Progress Timeline Component
- [ ] **Create:** `src/components/complaints/ProgressTimeline.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [ ] Display progress entries in timeline
    - [ ] Show status, notes, timestamp, staff name
    - [ ] Color-coded by status
    - [ ] Responsive design
  - **Dependencies:** MUI Timeline component (`@mui/lab`)

### 5.2 Add Progress Dialog Component
- [ ] **Create:** `src/components/complaints/AddProgressDialog.jsx`
  - **Priority:** 🔴 High
  - **Features:**
    - [ ] Status dropdown
    - [ ] Notes textarea
    - [ ] Form validation
    - [ ] Submit handler
    - [ ] Error handling

### 5.3 Financial Reports Component
- [ ] **Create:** `src/components/finance/FinancialReports.jsx`
  - **Priority:** 🟡 Medium
  - **Features:**
    - [ ] Month/Year selector
    - [ ] Summary cards
    - [ ] Charts (line, bar, pie)
    - [ ] Export buttons (future)
  - **Dependencies:** ApexCharts components

### 5.4 Staff Selector Component
- [ ] **Create:** `src/components/common/StaffSelector.jsx` (Optional)
  - **Features:**
    - [ ] Autocomplete with staff users
    - [ ] Filter by society
    - [ ] Display staff name and email

---

## 6. API Services Updates

### 6.1 New API Services
- [ ] **Create:** `src/api/superAdminApi.js`
  - `getGlobalReports(year)`

- [ ] **Create:** `src/api/settingsApi.js`
  - `getSettings(societyId)`
  - `updateSettings(societyId, data)`

- [ ] **Create:** `src/api/staffApi.js`
  - `getComplaints(params)`
  - `getPayments(params)`
  - `updatePaymentStatus(paymentId, data)`

### 6.2 Existing API Updates
- [ ] **Update:** `src/api/financeApi.js`
  - Add `getMonthlyReport(month, year)`
  - Add `getYearlyReport(year)`
  - Add `getPublicSummary(month, year)`
  - Update `create()` to handle income

- [ ] **Update:** `src/api/complaintApi.js`
  - Add `assignStaff(complaintId, staffId)`
  - Add `addProgress(complaintId, data)`
  - Add `getProgress(complaintId)`

- [ ] **Update:** `src/api/maintenanceApi.js`
  - Add `generateMonthlyDues()`

- [ ] **Update:** `src/api/residentApi.js`
  - Update `create()` and `update()` to handle JSONB fields

### 6.3 API Index Update
- [ ] **Update:** `src/api/index.js`
  - Export all new API services
  - Ensure consistent export pattern

---

## 7. Constants & Configuration

### 7.1 Constants Updates
- [x] **Update:** `src/utils/constants.js`
  - **ROLES:**
    - [x] Add `STAFF: 'staff'`
  - **ROUTES:**
    - [x] Add staff routes
    - [x] Add super admin reports route
    - [x] Add resident financial summary route
  - **API_ENDPOINTS:**
    - [x] Add all new endpoints
  - **New Constants:**
    - [x] `INCOME_TYPES` object
    - [x] `INCOME_TYPE_LABELS` object
    - [ ] `STAFF_PERMISSIONS` (if needed - optional)

---

## 8. Dependencies

### 8.1 New Dependencies
- [ ] **Install:** `@mui/lab` (for Timeline component)
  ```bash
  npm install @mui/lab
  ```

### 8.2 Existing Dependencies (Verify)
- [ ] Verify `@mui/x-date-pickers` is installed
- [ ] Verify `react-apexcharts` is installed
- [ ] Verify `react-hot-toast` is installed
- [ ] Verify `swr` is installed
- [ ] Verify `formik` and `yup` are installed

---

## 9. Testing Checklist

### 9.1 Super Admin Features
- [ ] Global reports page loads correctly
- [ ] Financial data aggregates correctly
- [ ] Complaint statistics display correctly
- [ ] Society breakdown shows accurate data

### 9.2 Admin Features
- [ ] Residents form includes all required fields
- [ ] Telephone bills and other bills can be added
- [ ] Auto-due generation button works
- [ ] Defaulter list respects visibility toggle
- [ ] Staff can be assigned to complaints
- [ ] Progress can be added to complaints
- [ ] Income entry form works
- [ ] Financial reports display correctly
- [ ] Settings toggles save and work

### 9.3 Resident Features
- [ ] Financial summary page loads (if visible)
- [ ] Public complaints are visible
- [ ] Defaulter list respects visibility

### 9.4 Staff Features
- [ ] Staff can login
- [ ] Staff dashboard displays correctly
- [ ] Staff can view assigned complaints
- [ ] Staff can update complaint progress
- [ ] Staff can update payment status
- [ ] Staff routes are protected

---

## 10. Implementation Priority

### Phase 1: High Priority (Week 1)
1. Staff Portal (Complete)
   - Staff routes
   - Staff dashboard
   - Staff complaints page
   - Staff payments page
   - Staff API services

2. Complaint Features
   - Staff assignment
   - Progress tracking
   - Progress timeline component

3. Income Entry
   - Income form
   - Income API integration

### Phase 2: Medium Priority (Week 2)
1. Financial Reports
   - Monthly reports
   - Yearly reports
   - Reports component

2. Settings Integration
   - Visibility toggles
   - Settings API integration

3. Global Reports
   - Super admin reports page
   - Reports API integration

### Phase 3: Low Priority (Week 3)
1. Residents Additional Fields
   - Telephone bills
   - Other bills

2. Maintenance Amount Config
   - Per-block/flat configuration

3. Export Functionality
   - PDF export
   - Excel export

---

## 11. File Structure

```
src/
├── pages/
│   ├── super-admin/
│   │   └── GlobalReports.jsx (NEW)
│   ├── admin/
│   │   ├── Residents.jsx (UPDATE)
│   │   ├── Maintenance.jsx (UPDATE)
│   │   ├── Complaints.jsx (UPDATE)
│   │   ├── Finance.jsx (UPDATE)
│   │   ├── Settings.jsx (UPDATE)
│   │   └── Defaulters.jsx (UPDATE)
│   ├── resident/
│   │   ├── FinancialSummary.jsx (NEW)
│   │   └── Complaints.jsx (UPDATE)
│   └── staff/ (NEW DIRECTORY)
│       ├── Dashboard.jsx (NEW)
│       ├── Complaints.jsx (NEW)
│       └── Payments.jsx (NEW)
├── components/
│   ├── complaints/
│   │   ├── ProgressTimeline.jsx (NEW)
│   │   └── AddProgressDialog.jsx (NEW)
│   ├── finance/
│   │   └── FinancialReports.jsx (NEW)
│   ├── payments/
│   │   └── UpdatePaymentDialog.jsx (NEW)
│   └── residents/
│       ├── TelephoneBillsInput.jsx (NEW, Optional)
│       └── OtherBillsInput.jsx (NEW, Optional)
├── api/
│   ├── superAdminApi.js (NEW)
│   ├── settingsApi.js (NEW)
│   ├── staffApi.js (NEW)
│   ├── financeApi.js (UPDATE)
│   ├── complaintApi.js (UPDATE)
│   ├── maintenanceApi.js (UPDATE)
│   └── residentApi.js (UPDATE)
└── routes/
    └── index.jsx (UPDATE)
```

---

## 12. Notes

- All features depend on corresponding backend API endpoints
- Test each feature after backend implementation
- Use existing components where possible (DataTable, charts, etc.)
- Follow existing code patterns and styling
- Ensure responsive design for all new pages
- Add proper error handling and loading states
- Use SWR for data fetching
- Use Formik + Yup for form validation
- Use react-hot-toast for notifications

---

**Last Updated:** 2026-01-26  
**Next Review:** After Phase 1 completion
