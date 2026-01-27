# Union Admin Guide - Homeland Union Management System

## 📋 Table of Contents
1. [Overview](#overview)
2. [Union Admin Role](#union-admin-role)
3. [Getting Started](#getting-started)
4. [Sidebar Navigation](#sidebar-navigation)
5. [Dashboard](#dashboard)
6. [Residents Management](#residents-management)
7. [Maintenance Management](#maintenance-management)
8. [Finance Management](#finance-management)
9. [Defaulters Management](#defaulters-management)
10. [Complaints Management](#complaints-management)
11. [Announcements Management](#announcements-management)
12. [Users Management](#users-management)
13. [Settings Management](#settings-management)
14. [Profile Management](#profile-management)
15. [Creating New Union Admin Users](#creating-new-union-admin-users)
16. [API Endpoints](#api-endpoints)
17. [Security & Permissions](#security--permissions)

---

## Overview

The **Union Admin** role is a society-specific administrative role in the Homeland Union Management System. Union Admins manage day-to-day operations for a single apartment society, including residents, maintenance fees, finances, complaints, and announcements.

**Key Characteristics:**
- Society-specific access (limited to one society)
- Can manage residents, maintenance, finance, complaints, and announcements
- Can create users (Union Admin, Resident, Staff) for their society
- Cannot create Super Admin users
- Full administrative control over their assigned society

---

## Union Admin Role

### Role Definition
- **Role Code:** `union_admin`
- **Database Value:** `'union_admin'` (stored in `users.role` column)
- **Access Level:** Society-level administrative privileges
- **Scope:** Limited to a single society (`society_apartment_id` must be set)

### Key Responsibilities
1. **Resident Management:** Add, edit, and manage residents within their society
2. **Maintenance Management:** Track maintenance fees, record payments, generate monthly dues
3. **Finance Management:** Record income and expenses, view financial reports
4. **Complaint Management:** View, assign, and track complaint resolution
5. **Defaulter Management:** Monitor and track payment defaulters
6. **Announcement Management:** Create and manage society announcements
7. **User Management:** Create users (Union Admin, Resident, Staff) for their society
8. **Settings Management:** Configure society settings and maintenance configurations

### Access Restrictions
- Union Admin users **MUST** be assigned to a specific society (`society_apartment_id` cannot be NULL)
- Can only access data from their assigned society
- Cannot create, update, or delete societies (Super Admin exclusive)
- Cannot create Super Admin users
- Cannot delete users (Super Admin exclusive)
- Cannot access global reports (Super Admin exclusive)

### Key Differences from Super Admin

| Feature | Super Admin | Union Admin |
|---------|-------------|-------------|
| **Society Access** | All societies | Single society only |
| **Create Societies** | ✅ Yes | ❌ No |
| **Create Super Admin** | ✅ Yes | ❌ No |
| **Delete Users** | ✅ Yes | ❌ No |
| **Global Reports** | ✅ Yes | ❌ No |
| **Property Management** | ✅ Yes (all) | ❌ No |
| **User Creation** | All roles | Union Admin, Resident, Staff only |

---

## Getting Started

### Login Credentials (Test Environment)
After running the database seed script (`npm run seed` in backend directory):

- **Email:** `unionadmin@homelandunion.com`
- **Password:** `admin123`
- **Dashboard URL:** `/admin/dashboard`
- **Assigned Society:** Homeland Union Society (ID: 1)

### First Steps After Login
1. **View Dashboard:** Check society statistics and overview
2. **Review Residents:** Familiarize yourself with existing residents
3. **Check Maintenance:** Review current maintenance fee status
4. **View Finance:** Check financial summary and transactions
5. **Review Complaints:** Check pending complaints and their status
6. **Configure Settings:** Set up society settings and maintenance configuration

---

## Sidebar Navigation

The Union Admin sidebar contains **9 main navigation tabs**:

| Tab | Icon | Route | Purpose |
|-----|------|-------|---------|
| **Dashboard** | DashboardIcon | `/admin/dashboard` | Society overview and statistics |
| **Residents** | PeopleIcon | `/admin/residents` | Manage residents and their information |
| **Maintenance** | PaymentIcon | `/admin/maintenance` | Track maintenance fees and payments |
| **Finance** | AccountBalanceIcon | `/admin/finance` | Manage income, expenses, and financial reports |
| **Defaulters** | WarningIcon | `/admin/defaulters` | Track payment defaulters |
| **Complaints** | FeedbackIcon | `/admin/complaints` | Manage and track resident complaints |
| **Announcements** | AnnouncementIcon | `/admin/announcements` | Create and manage society announcements |
| **Users** | PeopleIcon | `/admin/users` | Manage system users (Union Admin, Resident, Staff) |
| **Settings** | SettingsIcon | `/admin/settings` | Configure society settings and maintenance |

### Navigation Location
The sidebar is rendered in `src/components/layout/MainLayout.jsx` and dynamically shows menu items based on the user's role.

---

## Dashboard

**Route:** `/admin/dashboard`  
**Component:** `src/pages/admin/Dashboard.jsx`

### Overview
The Union Admin Dashboard provides a comprehensive overview of the assigned society, showing key statistics, charts, and recent activity.

### Features

#### 1. Statistics Cards
Four key metric cards displayed at the top:

- **Total Residents:** Total number of residents in the society
- **Total Balance:** Current financial balance (income - expenses)
- **Defaulters:** Number of residents with pending payments
- **Pending Complaints:** Number of unresolved complaints

#### 2. Financial Summary
- **Total Income:** Sum of all income transactions
- **Total Expenses:** Sum of all expense transactions
- **Net Balance:** Income minus expenses
- Visual indicators (trending up/down icons)

#### 3. Charts and Visualizations
- **Finance Chart:** Line chart showing income and expenses over time
- **Complaint Status Chart:** Pie chart showing complaint status distribution
- **Maintenance Status Chart:** Pie chart showing maintenance payment status

#### 4. Recent Activity Tables
- **Recent Complaints:** Last 5 complaints with status and priority
- **Recent Maintenance:** Last 5 maintenance records with payment status
- **Recent Announcements:** Last 5 announcements

### Data Sources
- **Residents:** `/api/residents` (filtered by `society_apartment_id`)
- **Finance Summary:** `/api/finance/summary` (filtered by `society_apartment_id`)
- **Defaulter Statistics:** `/api/defaulters/statistics` (filtered by `society_apartment_id`)
- **Complaints:** `/api/complaints/recent` (filtered by `society_apartment_id`)
- **Maintenance:** `/api/maintenance/recent` (filtered by `society_apartment_id`)
- **Announcements:** `/api/announcements/recent` (filtered by `society_apartment_id`)

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only data from the Union Admin's assigned society

---

## Residents Management

**Route:** `/admin/residents`  
**Component:** `src/pages/admin/Residents.jsx`

### Overview
The Residents Management page allows Union Admins to add, edit, view, and manage all residents within their assigned society.

### Features

#### 1. Resident List
- **Data Table:** Displays all residents with pagination
- **Search Functionality:** Search by name, email, or contact number
- **Columns:** Name, Email, Contact Number, Unit, Role, Move-in Date, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 2. Add New Resident
**Steps:**
1. Click **"Add Resident"** button
2. Fill in the form:
   - **Email** (required, unique)
   - **Password** (required, min 6 characters)
   - **Name** (required)
   - **Society** (pre-filled, cannot be changed)
   - **Unit** (select from available units)
   - **Contact Number** (optional)
   - **CNIC** (optional)
   - **Emergency Contact** (optional)
   - **Move-in Date** (optional)
   - **Role** (Resident or Union Admin)
3. Click **"Create"**

#### 3. Edit Resident
**Steps:**
1. Click **Edit** icon (pencil) next to a resident
2. Modify the information (email cannot be changed)
3. Click **"Update"**

#### 4. Delete Resident
**Steps:**
1. Click **Delete** icon (trash) next to a resident
2. Confirm deletion in the dialog
3. **Note:** Deleting a resident may affect related records (complaints, maintenance, etc.)

### Resident Information Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **Email** | String | ✅ Yes | Unique email address (login credential) |
| **Password** | String | ✅ Yes | Minimum 6 characters (only on create) |
| **Name** | String | ✅ Yes | Full name of the resident |
| **Society** | Number | ✅ Yes | Pre-filled with Union Admin's society |
| **Unit** | Number | Optional | Unit assignment (from available units) |
| **Contact Number** | String | Optional | Primary contact number |
| **CNIC** | String | Optional | National ID number |
| **Emergency Contact** | String | Optional | Emergency contact number |
| **Move-in Date** | Date | Optional | Date when resident moved in |
| **Role** | String | ✅ Yes | `resident` or `union_admin` |

### Unit Assignment
- Units are automatically filtered by the Union Admin's society
- Only available units are shown in the dropdown
- Unit information is displayed in the resident list

### API Endpoints Used
```javascript
// List residents (with pagination, search, and society filter)
GET /api/residents?page=1&limit=10&search=query&society_id=1

// Get resident by ID
GET /api/residents/:id

// Create resident
POST /api/residents
Body: { email, password, name, society_apartment_id, unit_id, ... }

// Update resident
PUT /api/residents/:id
Body: { name, unit_id, contact_number, ... }

// Delete resident
DELETE /api/residents/:id
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Create:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only residents from the Union Admin's assigned society

---

## Maintenance Management

**Route:** `/admin/maintenance`  
**Component:** `src/pages/admin/Maintenance.jsx`

### Overview
The Maintenance Management page allows Union Admins to track maintenance fees, record payments, generate monthly dues, and monitor payment status for all units in their society.

### Features

#### 1. Maintenance List
- **Data Table:** Displays all maintenance records with pagination
- **Search Functionality:** Search by unit number or resident name
- **Columns:** Unit, Resident, Month/Year, Base Amount, Total Amount, Status, Payment Date, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 2. Add New Maintenance Record
**Steps:**
1. Click **"Add Maintenance"** button
2. Fill in the form:
   - **Unit** (required, select from available units)
   - **Month** (required, 1-12)
   - **Year** (required)
   - **Base Amount** (required, minimum 0)
   - **Total Amount** (required, minimum 0)
3. Click **"Create"**

#### 3. Record Payment
**Steps:**
1. Click **Payment** icon next to a maintenance record
2. Enter payment details:
   - **Payment Date** (required)
   - **Amount Paid** (required, cannot exceed total amount)
3. Click **"Record Payment"**
4. Status automatically updates:
   - **Paid:** Full amount paid
   - **Partially Paid:** Partial payment made
   - **Pending:** No payment recorded

#### 4. Generate Monthly Dues
**Steps:**
1. Click **"Generate Monthly Dues"** button
2. Select:
   - **Month** (required)
   - **Year** (required)
   - **Base Amount** (required)
3. Click **"Generate"**
4. System automatically creates maintenance records for all units

#### 5. Edit Maintenance Record
**Steps:**
1. Click **Edit** icon (pencil) next to a record
2. Modify amounts or dates
3. Click **"Update"**

#### 6. Delete Maintenance Record
**Steps:**
1. Click **Delete** icon (trash) next to a record
2. Confirm deletion
3. **Warning:** Deleting maintenance records may affect financial reports

### Maintenance Status

| Status | Description | Conditions |
|--------|-------------|------------|
| **Pending** | No payment recorded | `payment_date` is NULL |
| **Partially Paid** | Partial payment made | `amount_paid < total_amount` |
| **Paid** | Full payment received | `amount_paid >= total_amount` |

### Monthly Dues Generation
- Automatically creates maintenance records for all units in the society
- Uses the configured base amount from Settings
- Can be customized per unit if needed
- Prevents duplicate entries for the same month/year/unit

### API Endpoints Used
```javascript
// List maintenance records
GET /api/maintenance?page=1&limit=10&search=query&society_id=1

// Get maintenance by ID
GET /api/maintenance/:id

// Create maintenance record
POST /api/maintenance
Body: { unit_id, month, year, base_amount, total_amount }

// Update maintenance record
PUT /api/maintenance/:id
Body: { base_amount, total_amount, ... }

// Record payment
POST /api/maintenance/:id/payment
Body: { payment_date, amount_paid }

// Generate monthly dues
POST /api/maintenance/generate-monthly-dues
Body: { month, year, base_amount, society_id }

// Delete maintenance record
DELETE /api/maintenance/:id
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Create:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** Union Admin only (`requireRole('union_admin')`)
- **Generate Dues:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only maintenance records from the Union Admin's assigned society

---

## Finance Management

**Route:** `/admin/finance`  
**Component:** `src/pages/admin/Finance.jsx`

### Overview
The Finance Management page allows Union Admins to record income and expenses, track financial transactions, view financial summaries, and generate financial reports.

### Features

#### 1. Financial Summary Cards
- **Total Income:** Sum of all income transactions
- **Total Expenses:** Sum of all expense transactions
- **Net Balance:** Income minus expenses
- Visual indicators with trending icons

#### 2. Transaction List
- **Data Table:** Displays all financial transactions with pagination
- **Search Functionality:** Search by description or transaction type
- **Tabs:** Separate tabs for "All Transactions", "Income", and "Expenses"
- **Columns:** Date, Type, Category, Description, Amount, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 3. Add Income Transaction
**Steps:**
1. Click **"Add Transaction"** button
2. Select **Transaction Type:** Income
3. Fill in the form:
   - **Income Type** (required):
     - Fines
     - Additional Charges
     - Other Income
   - **Amount** (required, minimum 0)
   - **Transaction Date** (required)
   - **Description** (required)
4. Click **"Create"**

#### 4. Add Expense Transaction
**Steps:**
1. Click **"Add Transaction"** button
2. Select **Transaction Type:** Expense
3. Fill in the form:
   - **Expense Type** (required):
     - Maintenance & Repairs
     - Utilities
     - Security
     - Cleaning
     - Other Expenses
   - **Amount** (required, minimum 0)
   - **Transaction Date** (required)
   - **Description** (required)
4. Click **"Create"**

#### 5. Edit Transaction
**Steps:**
1. Click **Edit** icon (pencil) next to a transaction
2. Modify transaction details
3. Click **"Update"**

#### 6. Delete Transaction
**Steps:**
1. Click **Delete** icon (trash) next to a transaction
2. Confirm deletion
3. **Warning:** Deleting transactions affects financial summaries

#### 7. Financial Reports
- **Monthly Reports:** View income and expenses by month
- **Yearly Reports:** View annual financial summary
- **Charts:** Visual representation of financial data
- **Export:** Download reports (if implemented)

### Income Types

| Type | Code | Description |
|------|------|-------------|
| **Fines** | `fines` | Penalties and fines collected |
| **Additional Charges** | `additional_charges` | Extra charges for services |
| **Other Income** | `other_income` | Miscellaneous income sources |

### Expense Types

| Type | Code | Description |
|------|------|-------------|
| **Maintenance & Repairs** | `maintenance_repairs` | Building maintenance and repairs |
| **Utilities** | `utilities` | Water, electricity, gas bills |
| **Security** | `security` | Security services and equipment |
| **Cleaning** | `cleaning` | Cleaning services and supplies |
| **Other Expenses** | `other_expenses` | Miscellaneous expenses |

### API Endpoints Used
```javascript
// List transactions
GET /api/finance?page=1&limit=10&search=query&society_id=1

// Get transaction by ID
GET /api/finance/:id

// Get financial summary
GET /api/finance/summary?society_id=1

// Create transaction
POST /api/finance
Body: { transaction_type, income_type/expense_type, amount, transaction_date, description }

// Update transaction
PUT /api/finance/:id
Body: { transaction_type, amount, description, ... }

// Delete transaction
DELETE /api/finance/:id

// Get monthly reports
GET /api/finance/reports/monthly?month=1&year=2024&society_id=1

// Get yearly reports
GET /api/finance/reports/yearly?year=2024&society_id=1
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Create:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only transactions from the Union Admin's assigned society

---

## Defaulters Management

**Route:** `/admin/defaulters`  
**Component:** `src/pages/admin/Defaulters.jsx`

### Overview
The Defaulters Management page allows Union Admins to track residents who have not paid their maintenance fees on time, view defaulter statistics, and update payment status.

### Features

#### 1. Defaulter Statistics
- **Total Defaulters:** Number of residents with pending payments
- **Total Outstanding Amount:** Sum of all unpaid maintenance fees
- **Average Outstanding:** Average amount per defaulter
- Visual cards with key metrics

#### 2. Defaulter List
- **Data Table:** Displays all defaulters with pagination
- **Search Functionality:** Search by resident name or unit number
- **Columns:** Resident Name, Unit, Outstanding Amount, Status, Last Payment Date, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 3. Defaulter Status
- **Active:** Currently has outstanding payments
- **Resolved:** All payments have been cleared
- **Warning:** Approaching payment deadline

#### 4. Update Payment Status
**Steps:**
1. Click **"Update Status"** button next to a defaulter
2. Record payment information
3. Status automatically updates when payment is recorded

### Defaulter Calculation
A resident is considered a defaulter if:
- They have maintenance records with status "Pending" or "Partially Paid"
- The payment due date has passed
- Outstanding amount > 0

### API Endpoints Used
```javascript
// Get defaulter statistics
GET /api/defaulters/statistics?society_id=1

// List defaulters
GET /api/defaulters?page=1&limit=10&search=query&society_id=1

// Get defaulter by ID
GET /api/defaulters/:id

// Update defaulter status
PUT /api/defaulters/:id/status
Body: { status, notes }
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only defaulters from the Union Admin's assigned society

---

## Complaints Management

**Route:** `/admin/complaints`  
**Component:** `src/pages/admin/Complaints.jsx`

### Overview
The Complaints Management page allows Union Admins to view all complaints from residents, update complaint status, assign complaints to staff members, track complaint progress, and manage complaint resolution.

### Features

#### 1. Complaints List
- **Data Table:** Displays all complaints with pagination
- **Search Functionality:** Search by complaint title, description, or resident name
- **Status Filter:** Filter by status (Pending, In Progress, Resolved, Closed)
- **Columns:** Title, Resident, Status, Priority, Created Date, Assigned To, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 2. View Complaint Details
**Steps:**
1. Click **View** icon (eye) next to a complaint
2. View full complaint information:
   - Complaint title and description
   - Resident information
   - Status and priority
   - Assignment details
   - Progress timeline
   - Attachments (if any)

#### 3. Update Complaint Status
**Steps:**
1. Click **Edit** icon (pencil) next to a complaint
2. Select new status:
   - **Pending:** New complaint, not yet addressed
   - **In Progress:** Complaint is being worked on
   - **Resolved:** Complaint has been resolved
   - **Closed:** Complaint is closed (no further action)
3. Optionally update priority
4. Click **"Update"**

#### 4. Assign Complaint to Staff
**Steps:**
1. Click **Assign** icon (person add) next to a complaint
2. Select staff member from dropdown
3. Click **"Assign"**
4. Staff member receives notification (if implemented)

#### 5. Add Progress Update
**Steps:**
1. Click **Progress** icon (update) next to a complaint
2. Add progress note:
   - **Status** (required)
   - **Notes** (required, description of progress)
   - **Date** (auto-filled)
3. Click **"Add Progress"**
4. Progress is added to the complaint timeline

### Complaint Status

| Status | Description | Next Actions |
|--------|-------------|--------------|
| **Pending** | New complaint, not yet addressed | Assign to staff or start working |
| **In Progress** | Complaint is being worked on | Add progress updates |
| **Resolved** | Complaint has been resolved | Close complaint |
| **Closed** | Complaint is closed | No further action needed |

### Complaint Priority

| Priority | Description | Response Time |
|----------|-------------|---------------|
| **Low** | Non-urgent issues | Standard response |
| **Medium** | Moderate urgency | Faster response |
| **High** | Urgent issues | Immediate attention |
| **Urgent** | Critical issues | Immediate action required |

### Progress Timeline
- Shows chronological history of complaint updates
- Displays status changes and notes
- Shows who made each update and when
- Visual timeline representation

### API Endpoints Used
```javascript
// List complaints
GET /api/complaints?page=1&limit=10&search=query&status=pending&society_id=1

// Get complaint by ID
GET /api/complaints/:id

// Update complaint status
PUT /api/complaints/:id/status
Body: { status, priority }

// Assign complaint
POST /api/complaints/:id/assign
Body: { staff_id }

// Add progress update
POST /api/complaints/:id/progress
Body: { status, notes }

// Get complaint progress history
GET /api/complaints/:id/progress

// Delete complaint
DELETE /api/complaints/:id
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Assign:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only complaints from the Union Admin's assigned society

---

## Announcements Management

**Route:** `/admin/announcements`  
**Component:** `src/pages/admin/Announcements.jsx`

### Overview
The Announcements Management page allows Union Admins to create, edit, view, and delete announcements for their society. Announcements are visible to all residents in the society.

### Features

#### 1. Announcements List
- **Data Table:** Displays all announcements with pagination
- **Search Functionality:** Search by title or description
- **Columns:** Title, Type, Created Date, Expiry Date, Status, Actions
- **Filtering:** Automatically filtered by `society_apartment_id`

#### 2. Create Announcement
**Steps:**
1. Click **"Add Announcement"** button
2. Fill in the form:
   - **Title** (required)
   - **Description** (required)
   - **Type** (required):
     - General
     - Maintenance
     - Event
     - Important
     - Other
   - **Expiry Date** (optional)
3. Click **"Create"**

#### 3. Edit Announcement
**Steps:**
1. Click **Edit** icon (pencil) next to an announcement
2. Modify announcement details
3. Click **"Update"**

#### 4. Delete Announcement
**Steps:**
1. Click **Delete** icon (trash) next to an announcement
2. Confirm deletion
3. Announcement is removed from the system

### Announcement Types

| Type | Description | Use Case |
|------|-------------|----------|
| **General** | General information | Regular updates, notices |
| **Maintenance** | Maintenance-related | Maintenance schedules, repairs |
| **Event** | Events and activities | Society events, meetings |
| **Important** | Important notices | Urgent information, policy changes |
| **Other** | Miscellaneous | Other announcements |

### API Endpoints Used
```javascript
// List announcements
GET /api/announcements?page=1&limit=10&search=query&society_id=1

// Get announcement by ID
GET /api/announcements/:id

// Create announcement
POST /api/announcements
Body: { title, description, type, expiry_date, society_id }

// Update announcement
PUT /api/announcements/:id
Body: { title, description, type, expiry_date }

// Delete announcement
DELETE /api/announcements/:id
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Create:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only announcements from the Union Admin's assigned society

---

## Users Management

**Route:** `/admin/users`  
**Component:** `src/pages/admin/Users.jsx`

### Overview
The Users Management page allows Union Admins to create, edit, view, and manage users within their society. Union Admins can create Union Admin, Resident, and Staff users, but cannot create Super Admin users.

### Features

#### 1. Users List
- **Data Table:** Displays all users with pagination
- **Search Functionality:** Search by name or email
- **Role Filter:** Filter by role (Union Admin, Resident, Staff)
- **Columns:** Name, Email, Role, Society, Status, Created Date, Actions
- **Filtering:** Automatically filtered by `society_apartment_id` (for Union Admin role)

#### 2. Create New User
**Steps:**
1. Click **"Add User"** button
2. Fill in the form:
   - **Email** (required, unique)
   - **Password** (required, min 6 characters)
   - **Name** (required)
   - **Role** (required):
     - Union Admin
     - Resident
     - Staff
   - **Society** (pre-filled, cannot be changed)
   - **Unit** (optional, for residents)
   - **Contact Number** (optional)
   - **CNIC** (optional)
3. Click **"Create"**

**Note:** Union Admins **CANNOT** create Super Admin users. The Super Admin option is not available in the role dropdown.

#### 3. Edit User
**Steps:**
1. Click **Edit** icon (pencil) next to a user
2. Modify user information (email cannot be changed)
3. Click **"Update"**

#### 4. Change User Password
**Steps:**
1. Click **Lock** icon (password) next to a user
2. Enter new password (min 6 characters)
3. Confirm password
4. Click **"Update Password"**

#### 5. Activate/Deactivate User
**Steps:**
1. Click **Edit** icon next to a user
2. Toggle **Active Status**
3. Click **"Update"**
4. Inactive users cannot log in

#### 6. Delete User
**Note:** Union Admins **CANNOT** delete users. Only Super Admins have delete permissions.

### User Roles Available to Union Admin

| Role | Code | Can Create | Description |
|------|------|------------|-------------|
| **Union Admin** | `union_admin` | ✅ Yes | Society-specific admin (like current user) |
| **Resident** | `resident` | ✅ Yes | Regular resident user |
| **Staff** | `staff` | ✅ Yes | Staff member for complaint handling |
| **Super Admin** | `super_admin` | ❌ No | System-wide admin (Super Admin only) |

### Union Admin Restrictions

1. **Cannot Create Super Admin:**
   - Super Admin option is not visible in the role dropdown
   - Frontend restriction prevents Super Admin creation
   - Backend also validates this restriction

2. **Cannot Delete Users:**
   - Delete button is not available for Union Admins
   - Only Super Admins can delete users

3. **Limited User View:**
   - Can only see users from their assigned society
   - Cannot view users from other societies

### API Endpoints Used
```javascript
// List users (with pagination, search, and role filter)
GET /api/users?page=1&limit=10&search=query&role=union_admin

// Get user by ID
GET /api/users/:id

// Create user
POST /api/auth/register
Body: { email, password, name, role, society_apartment_id, ... }

// Update user
PUT /api/users/:id
Body: { name, role, is_active, ... }

// Update password
PATCH /api/users/:id/password
Body: { new_password }
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Create:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Delete:** ❌ Not allowed (Super Admin only)
- **Create Super Admin:** ❌ Not allowed (Super Admin only)
- **Data Scope:** Only users from the Union Admin's assigned society

---

## Settings Management

**Route:** `/admin/settings`  
**Component:** `src/pages/admin/Settings.jsx`

### Overview
The Settings Management page allows Union Admins to configure society-specific settings, including visibility toggles for residents and maintenance fee configurations.

### Features

#### 1. Visibility Settings Tab
Controls what information residents can see:

- **Defaulter List Visible:** Toggle visibility of defaulter list to residents
- **Complaint Logs Visible:** Toggle visibility of complaint logs to residents
- **Financial Reports Visible:** Toggle visibility of financial reports to residents

**Steps to Update:**
1. Navigate to **Settings** page
2. Go to **Visibility Settings** tab
3. Toggle switches as needed
4. Settings are saved automatically

#### 2. Maintenance Configuration Tab
Configure maintenance fee settings:

- **Base Amount:** Default maintenance fee amount per unit
- **Per-Block Configuration:** (Future feature) Set different amounts per block
- **Per-Unit Configuration:** (Future feature) Set different amounts per unit

**Steps to Update:**
1. Navigate to **Settings** page
2. Go to **Maintenance Configuration** tab
3. Enter base amount
4. Click **"Save Configuration"**

### Visibility Settings Explained

| Setting | Description | Impact |
|---------|-------------|--------|
| **Defaulter List Visible** | Shows defaulter list to residents | If enabled, residents can see who hasn't paid |
| **Complaint Logs Visible** | Shows complaint logs to residents | If enabled, residents can see all complaints |
| **Financial Reports Visible** | Shows financial reports to residents | If enabled, residents can view financial summaries |

### Maintenance Configuration

- **Base Amount:** Used when generating monthly dues
- Applied to all units unless overridden
- Can be updated at any time
- Changes affect future monthly dues generation

### API Endpoints Used
```javascript
// Get settings
GET /api/settings/:societyId

// Update settings
PUT /api/settings/:societyId
Body: { defaulter_list_visible, complaint_logs_visible, financial_reports_visible }

// Get maintenance config
GET /api/settings/:societyId/maintenance-config

// Update maintenance config
PUT /api/settings/:societyId/maintenance-config
Body: { base_amount }
```

### Permissions
- **View:** Union Admin only (`requireRole('union_admin')`)
- **Update:** Union Admin only (`requireRole('union_admin')`)
- **Data Scope:** Only settings for the Union Admin's assigned society

---

## Profile Management

**Route:** `/admin/profile` (Note: Uses Resident Profile component)  
**Component:** `src/pages/resident/Profile.jsx` (shared component)

### Overview
The Profile Management page allows Union Admins to view and update their personal account information, including name, contact details, and profile picture.

### Features

#### 1. Profile Picture
- **Upload Photo:** Click "Upload Photo" to select an image
- **Change Photo:** Replace existing profile picture
- **Remove Photo:** Remove current profile picture
- **Requirements:**
  - Square image recommended
  - Maximum size: 2MB
  - Supported formats: JPG, PNG

#### 2. Account Information
- **Name:** Full name (required, can be updated)
- **Email:** Email address (cannot be changed, used for login)
- **Role:** Displayed as "Union Admin" (read-only)

#### 3. Contact Information
- **Contact Number:** Primary contact number (optional)
- **Emergency Contact:** Emergency contact number (optional)
- **CNIC:** National ID number (optional)

#### 4. Update Profile
**Steps:**
1. Navigate to **Profile** (via sidebar or user menu)
2. Modify information as needed
3. Upload or change profile picture if desired
4. Click **"Save Changes"**
5. Changes are saved immediately

### Profile Image Storage
- Images are stored as files in `backend/uploads/profiles/`
- File path format: `/uploads/profiles/user_{userId}_{timestamp}.{ext}`
- Images are served as static files from the server
- Legacy base64 format is also supported for backward compatibility

### API Endpoints Used
```javascript
// Get current user profile
GET /api/auth/me

// Update profile
PUT /api/auth/me
Body: { name, contact_number, emergency_contact, cnic, profile_image (file) }
```

### Permissions
- **View:** Authenticated users only
- **Update:** Own profile only
- **Data Scope:** Only the logged-in user's profile

---

## Society Assignment - How Union Admin Users Are Assigned to Societies

### Who Decides the Assignment?

**⚠️ IMPORTANT: Current Implementation Status**

**The society selection dropdown is NOT currently implemented in the UI.** However, the backend API supports society assignment. Here's the current state:

#### 1. **Super Admin Creates Union Admin** (Current State)
- **Who:** Super Admin
- **When:** During user creation
- **How:** Currently, there is NO society dropdown in the Users page UI
- **Where:** `/super-admin/users` page
- **Current Behavior:** Society assignment must be done via:
  - Direct API call with `society_apartment_id` parameter
  - Database UPDATE after user creation
  - Backend may auto-assign based on context (needs verification)
- **Future Enhancement:** A society dropdown should be added to allow Super Admin to select which society to assign

#### 2. **Union Admin Creates Another Union Admin** (Current State)
- **Who:** Existing Union Admin
- **When:** During user creation
- **How:** Society is automatically set to the creating Union Admin's `society_apartment_id` (if backend handles this)
- **Where:** `/admin/users` page
- **Current Behavior:** No society field visible in UI - backend should auto-assign based on logged-in user's society
- **Decision Authority:** Union Admin can only create Union Admins for their own society (enforced by backend)

### How the System Knows About the Assignment

The system tracks society assignment through the **`society_apartment_id`** field in the `users` table:

#### Database Structure
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    society_apartment_id INTEGER,  -- This field stores the society assignment
    ...
);
```

#### How It Works

1. **During User Creation:**
   - When Super Admin creates a Union Admin, they select a society from the dropdown
   - The selected society ID is stored in `society_apartment_id` field
   - This value is **required** for Union Admin users (cannot be NULL)

2. **During Authentication:**
   - When a Union Admin logs in, the system retrieves their `society_apartment_id` from the database
   - This value is stored in the JWT token payload (via `req.user.society_apartment_id`)
   - Every API request includes this information in the authentication middleware

3. **During Data Access:**
   - All API endpoints automatically filter data by `society_apartment_id`
   - Union Admin can only see/modify data from their assigned society
   - Backend middleware enforces this restriction

#### Example Flow

```
1. Super Admin creates Union Admin:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Role: "union_admin"
   - Society: "Homeland Union Society" (ID: 1) ← Super Admin selects this
   
2. Database stores:
   INSERT INTO users (..., society_apartment_id) 
   VALUES (..., 1)  ← Society ID stored here

3. When Union Admin logs in:
   - System reads: society_apartment_id = 1
   - Stores in JWT token: req.user.society_apartment_id = 1
   
4. When Union Admin accesses data:
   - API automatically filters: WHERE society_apartment_id = 1
   - Union Admin only sees data from Society ID 1
```

### Assignment Rules (Current Implementation)

| Scenario | Who Assigns | Can Change? | Society Selection | UI Status |
|----------|-------------|-------------|------------------|-----------|
| **Super Admin creates Union Admin** | Super Admin | ✅ Yes (via API/DB) | ⚠️ **No UI dropdown** - Must use API | ❌ Not implemented |
| **Union Admin creates Union Admin** | Union Admin | ❌ No | Auto-assigned by backend | ✅ Works (backend) |
| **During Seed Script** | System | ✅ Yes (via UPDATE) | Hardcoded in script | ✅ Works |
| **Via API** | API caller | ✅ Yes | Must provide `society_apartment_id` | ✅ Works |
| **Edit User** | Super Admin | ✅ Yes | ⚠️ **No UI field** - Must use API | ❌ Not implemented |

### Changing Society Assignment

**Can a Union Admin's society be changed?**

- ✅ **Yes** - Super Admin can change it via the Users page
- ❌ **No** - Union Admin cannot change their own society
- ✅ **Yes** - Can be changed via database UPDATE (not recommended)

**How to Change (Current Methods):**

**Method 1: Via API (Recommended)**
```javascript
PUT /api/users/:id
Headers: { Authorization: "Bearer <super_admin_token>" }
Body: {
  society_apartment_id: 2  // New society ID
}
```

**Method 2: Via Database (Not Recommended)**
```sql
UPDATE users 
SET society_apartment_id = 2 
WHERE id = <user_id> AND role = 'union_admin';
```

**⚠️ Note:** The Users page UI does NOT currently have a society selection dropdown. This is a missing feature that should be implemented in the future.

### Verification Methods

#### 1. **Check in Database**
```sql
SELECT id, email, name, role, society_apartment_id 
FROM users 
WHERE role = 'union_admin';
```

#### 2. **Check via API**
```javascript
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: {
  "data": {
    "id": 2,
    "email": "unionadmin@example.com",
    "name": "Union Admin",
    "role": "union_admin",
    "society_apartment_id": 1  ← This shows the assigned society
  }
}
```

#### 3. **Check in Frontend**
- Union Admin's profile shows their assigned society
- All data is automatically filtered by `society_apartment_id`
- Cannot access data from other societies

### Important Notes

1. **Mandatory Assignment:** Union Admin users **MUST** have a `society_apartment_id`. The system enforces this:
   - Cannot create Union Admin without society assignment
   - Backend validates this requirement
   - Frontend prevents submission without society selection

2. **Data Isolation:** Once assigned, Union Admin can only access data from their assigned society:
   - All API queries automatically filter by `society_apartment_id`
   - Cannot see residents, maintenance, finance, etc. from other societies
   - Backend middleware enforces this security

3. **One Society Per Union Admin:** Each Union Admin is assigned to exactly one society:
   - `society_apartment_id` is a single integer value
   - Cannot be assigned to multiple societies
   - If needed, create separate Union Admin accounts for each society

4. **Super Admin Control:** Only Super Admin can:
   - Assign Union Admin to any society
   - Change Union Admin's society assignment
   - View all Union Admins across all societies

---

## Creating New Union Admin Users

Union Admin users can be created by **Super Admins** or **existing Union Admins**. Here are the different methods:

### Method 1: Through Users Page (Recommended)

**By Super Admin:**
1. Login as Super Admin
2. Navigate to **Users** page (`/super-admin/users`)
3. Click **"Add User"** button
4. Fill in the form:
   - **Email:** Unique email address
   - **Password:** Secure password (min 6 characters)
   - **Name:** Full name
   - **Role:** Select "Union Admin"
   - **⚠️ Society:** Currently NO dropdown in UI - must assign via API after creation
5. Click **"Create"**
6. **After creation:** Use API to assign society:
   ```javascript
   PUT /api/users/:id
   Body: { society_apartment_id: <society_id> }
   ```

**⚠️ Note:** The society selection dropdown is NOT currently implemented in the UI. This is a known limitation that should be addressed in future updates.

**By Union Admin:**
1. Login as Union Admin
2. Navigate to **Users** page (`/admin/users`)
3. Click **"Add User"** button
4. Fill in the form:
   - **Email:** Unique email address
   - **Password:** Secure password (min 6 characters)
   - **Name:** Full name
   - **Role:** Select "Union Admin"
   - **Society:** Pre-filled (cannot be changed)
5. Click **"Create"**

**Note:** Union Admins can only create Union Admin users for their own society.

### Method 2: Through API Endpoint (Direct)

Union Admins can create new users (Union Admin, Resident, Staff) via the registration API:

```javascript
POST /api/auth/register
Headers: {
  Authorization: "Bearer <union_admin_token>"
}
Body: {
  email: "newunionadmin@example.com",
  password: "securepassword123",
  name: "New Union Admin",
  role: "union_admin",
  society_apartment_id: 1  // Must match Union Admin's society
}
```

**Requirements:**
- Must be authenticated as Union Admin or Super Admin
- Endpoint requires `requireRole('super_admin', 'union_admin')`
- Union Admins can only create users for their assigned society
- Union Admins cannot create Super Admin users

### Method 3: Database Seed Script

During initial setup, a Union Admin user is created via the seed script:

```bash
cd backend
npm run seed
```

This creates:
- **Email:** `unionadmin@homelandunion.com`
- **Password:** `admin123`
- **Role:** `union_admin`
- **Society:** Homeland Union Society (ID: 1)

### Method 4: Direct Database Insert (Not Recommended)

Union Admin users can be inserted directly into the database, but this is **not recommended** for production:

```sql
INSERT INTO users (email, password, name, role, society_apartment_id, is_active)
VALUES (
  'newunionadmin@example.com',
  '$2a$10$hashed_password_here',  -- Must be bcrypt hashed
  'New Union Admin',
  'union_admin',
  1,  -- Must reference existing society
  true
);
```

### Security Considerations

1. **Society Assignment:** Union Admin users **MUST** have a `society_apartment_id` set
2. **Password Hashing:** Passwords must be bcrypt hashed (10 rounds)
3. **Email Uniqueness:** Email addresses must be unique across all users
4. **Active Status:** New users are created with `is_active = true` by default
5. **Created By Tracking:** The `created_by` field tracks which user created the new user
6. **Limited Scope:** Union Admins can only create users for their assigned society

### User Management Capabilities

Union Admins can:
- ✅ Create users of **Union Admin, Resident, and Staff** roles
- ✅ Update user information (name, role, active status)
- ✅ Change user passwords
- ❌ **Cannot** delete users (Super Admin only)
- ❌ **Cannot** create Super Admin users
- ❌ **Cannot** create users for other societies

---

## API Endpoints

### Authentication Endpoints

```javascript
// Login
POST /api/auth/login
Body: { email, password }

// Get current user
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }

// Update profile
PUT /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Body: { name, contact_number, emergency_contact, cnic, profile_image }

// Register new user (Union Admin, Resident, Staff)
POST /api/auth/register
Headers: { Authorization: "Bearer <token>" }
Body: { email, password, name, role, society_apartment_id, ... }

// Refresh token
POST /api/auth/refresh

// Logout
POST /api/auth/logout
```

### Residents Endpoints

```javascript
// List residents
GET /api/residents?page=1&limit=10&search=query&society_id=1

// Get resident by ID
GET /api/residents/:id

// Create resident
POST /api/residents
Body: { email, password, name, society_apartment_id, unit_id, ... }

// Update resident
PUT /api/residents/:id
Body: { name, unit_id, contact_number, ... }

// Delete resident
DELETE /api/residents/:id
```

### Maintenance Endpoints

```javascript
// List maintenance records
GET /api/maintenance?page=1&limit=10&search=query&society_id=1

// Get maintenance by ID
GET /api/maintenance/:id

// Create maintenance record
POST /api/maintenance
Body: { unit_id, month, year, base_amount, total_amount }

// Update maintenance record
PUT /api/maintenance/:id
Body: { base_amount, total_amount, ... }

// Record payment
POST /api/maintenance/:id/payment
Body: { payment_date, amount_paid }

// Generate monthly dues
POST /api/maintenance/generate-monthly-dues
Body: { month, year, base_amount, society_id }

// Delete maintenance record
DELETE /api/maintenance/:id
```

### Finance Endpoints

```javascript
// List transactions
GET /api/finance?page=1&limit=10&search=query&society_id=1

// Get transaction by ID
GET /api/finance/:id

// Get financial summary
GET /api/finance/summary?society_id=1

// Create transaction
POST /api/finance
Body: { transaction_type, income_type/expense_type, amount, transaction_date, description }

// Update transaction
PUT /api/finance/:id
Body: { transaction_type, amount, description, ... }

// Delete transaction
DELETE /api/finance/:id

// Get monthly reports
GET /api/finance/reports/monthly?month=1&year=2024&society_id=1

// Get yearly reports
GET /api/finance/reports/yearly?year=2024&society_id=1
```

### Complaints Endpoints

```javascript
// List complaints
GET /api/complaints?page=1&limit=10&search=query&status=pending&society_id=1

// Get complaint by ID
GET /api/complaints/:id

// Update complaint status
PUT /api/complaints/:id/status
Body: { status, priority }

// Assign complaint
POST /api/complaints/:id/assign
Body: { staff_id }

// Add progress update
POST /api/complaints/:id/progress
Body: { status, notes }

// Get complaint progress history
GET /api/complaints/:id/progress

// Delete complaint
DELETE /api/complaints/:id
```

### Defaulters Endpoints

```javascript
// Get defaulter statistics
GET /api/defaulters/statistics?society_id=1

// List defaulters
GET /api/defaulters?page=1&limit=10&search=query&society_id=1

// Get defaulter by ID
GET /api/defaulters/:id

// Update defaulter status
PUT /api/defaulters/:id/status
Body: { status, notes }
```

### Announcements Endpoints

```javascript
// List announcements
GET /api/announcements?page=1&limit=10&search=query&society_id=1

// Get announcement by ID
GET /api/announcements/:id

// Create announcement
POST /api/announcements
Body: { title, description, type, expiry_date, society_id }

// Update announcement
PUT /api/announcements/:id
Body: { title, description, type, expiry_date }

// Delete announcement
DELETE /api/announcements/:id
```

### Users Endpoints

```javascript
// List users
GET /api/users?page=1&limit=10&search=query&role=union_admin

// Get user by ID
GET /api/users/:id

// Update user
PUT /api/users/:id
Body: { name, role, is_active, ... }

// Update password
PATCH /api/users/:id/password
Body: { new_password }
```

### Settings Endpoints

```javascript
// Get settings
GET /api/settings/:societyId

// Update settings
PUT /api/settings/:societyId
Body: { defaulter_list_visible, complaint_logs_visible, financial_reports_visible }

// Get maintenance config
GET /api/settings/:societyId/maintenance-config

// Update maintenance config
PUT /api/settings/:societyId/maintenance-config
Body: { base_amount }
```

---

## Security & Permissions

### Role-Based Access Control (RBAC)

The system uses role-based access control to restrict access to different features:

| Feature | Super Admin | Union Admin | Resident | Staff |
|---------|-------------|-------------|----------|-------|
| **View All Societies** | ✅ | ❌ | ❌ | ❌ |
| **Create Societies** | ✅ | ❌ | ❌ | ❌ |
| **Manage Residents** | ✅ | ✅ (own society) | ❌ | ❌ |
| **Manage Maintenance** | ✅ | ✅ (own society) | ❌ | ❌ |
| **Manage Finance** | ✅ | ✅ (own society) | ❌ | ❌ |
| **Manage Complaints** | ✅ | ✅ (own society) | View own | View assigned |
| **Manage Announcements** | ✅ | ✅ (own society) | View | ❌ |
| **Create Users** | ✅ (all roles) | ✅ (Union Admin, Resident, Staff) | ❌ | ❌ |
| **Delete Users** | ✅ | ❌ | ❌ | ❌ |
| **Create Super Admin** | ✅ | ❌ | ❌ | ❌ |
| **Global Reports** | ✅ | ❌ | ❌ | ❌ |

### Data Isolation

- **Society-Specific Data:** All Union Admin operations are automatically filtered by `society_apartment_id`
- **Automatic Filtering:** Backend APIs automatically apply society filters
- **No Cross-Society Access:** Union Admins cannot access data from other societies

### Authentication & Authorization

- **JWT Tokens:** All API requests require valid JWT tokens
- **Token Expiry:** Access tokens expire after 15 minutes (configurable)
- **Refresh Tokens:** Refresh tokens expire after 7 days (configurable)
- **Role Validation:** Backend validates user role on every request
- **Society Validation:** Backend validates society access on every request

### Security Best Practices

1. **Password Requirements:**
   - Minimum 6 characters
   - Stored as bcrypt hashes (10 rounds)
   - Never transmitted in plain text

2. **API Security:**
   - All endpoints require authentication
   - Role-based access control enforced
   - Society-based data isolation

3. **Data Protection:**
   - Sensitive data encrypted in transit (HTTPS recommended)
   - User passwords never logged
   - SQL injection prevention via parameterized queries

4. **Session Management:**
   - Tokens stored in httpOnly cookies (refresh tokens)
   - Access tokens stored in localStorage
   - Automatic token refresh on expiry

---

## Summary

The **Union Admin** role is designed for society-specific administration, providing comprehensive management capabilities for a single apartment society. Union Admins can:

- ✅ Manage residents, maintenance, finance, complaints, and announcements
- ✅ Create users (Union Admin, Resident, Staff) for their society
- ✅ Configure society settings and maintenance fees
- ✅ Track defaulters and manage complaint resolution
- ❌ Cannot create Super Admin users
- ❌ Cannot delete users
- ❌ Cannot access other societies' data
- ❌ Cannot create or manage societies

This role provides a perfect balance between administrative control and data isolation, ensuring that each society's data remains secure and separate while allowing Union Admins full control over their assigned society's operations.

---

**Last Updated:** January 2026  
**Version:** 1.0  
**System:** Homeland Union Management System
