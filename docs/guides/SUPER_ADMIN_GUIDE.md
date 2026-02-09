# Super Admin Guide - Homeland Union Management System

## 📋 Table of Contents
1. [Overview](#overview)
2. [Super Admin Role](#super-admin-role)
3. [Getting Started](#getting-started)
4. [Sidebar Navigation](#sidebar-navigation)
5. [Dashboard](#dashboard)
6. [Apartments Management](#apartments-management)
7. [Blocks Management](#blocks-management)
8. [Floors Management](#floors-management)
9. [Units Management](#units-management)
10. [Global Reports](#global-reports)
11. [Profile Management](#profile-management)
12. [Creating New Super Admin Users](#creating-new-super-admin-users)
13. [API Endpoints](#api-endpoints)
14. [Security & Permissions](#security--permissions)

---

## Overview

The **Super Admin** role is the highest level of access in the Homeland Union Management System. Super Admins have system-wide privileges and can manage multiple societies, properties, and view cross-society analytics.

**Key Characteristics:**
- System-wide access across all societies
- Can create and manage societies, blocks, floors, and units
- Access to global reports and analytics
- Can create users of any role (including other Super Admins)
- Full administrative control over the platform

---

## Super Admin Role

### Role Definition
- **Role Code:** `super_admin`
- **Database Value:** `'super_admin'` (stored in `users.role` column)
- **Access Level:** Highest privilege level
- **Scope:** System-wide (not limited to a single society)

### Key Responsibilities
1. **System Setup:** Create and configure societies, blocks, floors, and units
2. **User Management:** Create users of all roles (Super Admin, Union Admin, Resident, Staff)
3. **Global Oversight:** View cross-society reports and analytics
4. **Property Management:** Manage the entire property hierarchy (Society → Block → Floor → Unit)

### Access Restrictions
- Super Admin users are **NOT** restricted to a specific society (`society_apartment_id` can be NULL)
- Can access data from all societies in the system
- Can create, update, and delete societies (exclusive privilege)

---

## Getting Started

### Login Credentials (Test Environment)
After running the database seed script (`npm run seed` in backend directory):

- **Email:** `admin@homelandunion.com`
- **Password:** `admin123`
- **Dashboard URL:** `/super-admin/dashboard`

### First Steps After Login
1. **View Dashboard:** Check system-wide statistics
2. **Create Apartments:** Set up new apartment complexes
3. **Configure Properties:** Add blocks, floors, and units
4. **Create Users:** Set up Union Admins, Residents, and Staff (via Users page)
5. **View Reports:** Access global analytics

---

## Sidebar Navigation

The Super Admin sidebar contains **8 main navigation tabs**:

| Tab | Icon | Route | Purpose |
|-----|------|-------|---------|
| **Dashboard** | DashboardIcon | `/super-admin/dashboard` | System overview and statistics |
| **Apartments** | ApartmentIcon | `/super-admin/societies` | Manage apartment complexes |
| **Blocks** | ApartmentIcon | `/super-admin/blocks` | Manage building blocks |
| **Floors** | ApartmentIcon | `/super-admin/floors` | Manage floor structures |
| **Units** | ApartmentIcon | `/super-admin/units` | Manage individual units |
| **Users** | PeopleIcon | `/super-admin/users` | Manage system users (all roles) |
| **Global Reports** | AssessmentIcon | `/super-admin/reports` | Cross-society analytics |
| **Profile** | AccountCircleIcon | `/super-admin/profile` | Manage your own account details |

### Navigation Location
The sidebar is rendered in `src/components/layout/MainLayout.jsx` and dynamically shows menu items based on the user's role.

---

## Dashboard

**Route:** `/super-admin/dashboard`  
**Component:** `src/pages/super-admin/Dashboard.jsx`

### Overview
The Super Admin Dashboard provides a high-level view of the entire system, showing aggregated statistics across all societies.

### Features

#### 1. Statistics Cards
Three key metric cards displayed at the top:

- **Total Apartments**
  - Icon: ApartmentIcon (Primary color)
  - Shows: Count of all apartments in the system
  - Data Source: `apartmentApi.getAll()`

- **Total Blocks**
  - Icon: BusinessIcon (Secondary color)
  - Shows: Count of all blocks across all societies
  - Data Source: `propertyApi.getBlocks()`

- **Total Units**
  - Icon: HomeIcon (Success color)
  - Shows: Count of all units across all societies
  - Data Source: `propertyApi.getUnits()`

#### 2. System Overview Chart
- **Chart Type:** Bar Chart
- **Title:** "Units per Apartment"
- **X-Axis:** Apartment names
- **Y-Axis:** Total units count
- **Purpose:** Visual comparison of unit distribution across apartments
- **Component:** `BarChart` from `@/components/charts/BarChart`

#### 3. Apartments Overview Section
- **Layout:** Grid of cards (2 columns on medium+ screens)
- **Information Displayed:**
  - Apartment name
  - Address and city
  - Total blocks count
  - Total units count
- **Purpose:** Quick reference of all apartments with key metrics

### Data Loading
- Uses **SWR** (stale-while-revalidate) for data fetching
- Loading states shown with `CircularProgress` component
- Data automatically refreshes when navigating to the page

### API Calls
```javascript
// Societies
GET /api/societies?limit=100

// Blocks
GET /api/properties/blocks

// Units
GET /api/properties/units?limit=100
```

---

## Apartments Management

**Route:** `/super-admin/societies`  
**Component:** `src/pages/super-admin/Apartments.jsx`

### Overview
Apartments represent apartment complexes or residential communities. This page allows Super Admins to create, view, edit, and delete apartments.

### Features

#### 1. Apartment List Table
- **Columns:**
  - Name
  - Address
  - City
  - Blocks (total count)
  - Units (total count)
  - Actions (Edit, Delete)

#### 2. Search Functionality
- **Search Field:** Full-width search bar at the top
- **Search Scope:** Searches across society name, address, and city
- **Real-time:** Updates results as you type

#### 3. Pagination
- **Default:** 10 items per page
- **Controls:** Page navigation and rows per page selector
- **Data Source:** Paginated API response

#### 4. Create Apartment Dialog
**Fields:**
- **Name** (Required) - Society/complex name
- **Address** (Optional) - Full address text
- **City** (Optional) - City name
- **Total Blocks** (Optional) - Number of blocks (default: 0)
- **Total Units** (Optional) - Number of units (default: 0)

**Validation:**
- Name is required
- Uses Formik + Yup for form validation

#### 5. Edit Society
- Click the **Edit icon** (pencil) on any society row
- Opens the same dialog with pre-filled values
- Updates existing society record

#### 6. Delete Society
- Click the **Delete icon** (trash) on any society row
- Confirmation dialog appears
- **Warning:** Deleting a society may cascade delete related blocks, floors, and units (depending on database constraints)

### API Endpoints Used
```javascript
// List societies (with pagination and search)
GET /api/societies?page=1&limit=10&search=query

// Create society
POST /api/societies
Body: { name, address, city, total_blocks, total_units }

// Update society
PUT /api/societies/:id
Body: { name, address, city, total_blocks, total_units }

// Delete society
DELETE /api/societies/:id
```

### Permissions
- **Create:** Only Super Admin (`requireRole('super_admin')`)
- **Update:** Only Super Admin (`requireRole('super_admin')`)
- **Delete:** Only Super Admin (`requireRole('super_admin')`)

---

## Blocks Management

**Route:** `/super-admin/blocks`  
**Component:** `src/pages/super-admin/Blocks.jsx`

### Overview
Blocks represent individual buildings within a society. This page allows Super Admins to create and manage blocks, which are organized under societies.

### Features

#### 1. Society Filter
- **Dropdown:** Select a society to filter blocks
- **Default:** "All Societies" (shows all blocks)
- **Purpose:** Filter blocks by their parent society
- **Dynamic:** Updates block list when society is selected

#### 2. Block List Table
- **Columns:**
  - Block Name
  - Society Name
  - Total Floors
  - Total Units
  - Actions (Edit only - delete not implemented)

#### 3. Create Block Dialog
**Fields:**
- **Society** (Required) - Dropdown to select parent society
- **Block Name** (Required) - Name of the block/building
- **Total Floors** (Optional) - Number of floors (default: 0)
- **Total Units** (Optional) - Number of units (default: 0)

**Validation:**
- Society selection is required
- Block name is required

#### 4. Edit Block
- Click the **Edit icon** on any block row
- Opens dialog with pre-filled values
- **Note:** Society field is disabled when editing (to prevent data inconsistency)
- Can update: Block Name, Total Floors, Total Units
- Uses `PUT /api/properties/blocks/:id` endpoint

### Hierarchical Structure
```
Society
  └── Block
      └── Floor
          └── Unit
```

### API Endpoints Used
```javascript
// List societies (for dropdown)
GET /api/societies?limit=100

// List blocks (filtered by society)
GET /api/properties/blocks?society_id=123

// Create block
POST /api/properties/blocks
Body: { society_apartment_id, name, total_floors, total_units }

// Update block
PUT /api/properties/blocks/:id
Body: { name, total_floors, total_units }
// Note: society_apartment_id cannot be changed after creation
```

### Permissions
- **Create:** Only Super Admin (`requireRole('super_admin')`)
- **View:** All authenticated users can view blocks

---

## Floors Management

**Route:** `/super-admin/floors`  
**Component:** `src/pages/super-admin/Floors.jsx`

### Overview
Floors represent individual floor levels within a block. This page allows Super Admins to create and manage floors, which are organized hierarchically under blocks.

### Features

#### 1. Hierarchical Selection
**Two-level filtering:**
1. **Select Society** - First dropdown to choose a society
2. **Select Block** - Second dropdown (enabled after society selection) to choose a block

**Cascading Behavior:**
- Selecting a society loads its blocks
- Selecting a block loads its floors
- Changing society resets block selection

#### 2. Floor List Table
- **Columns:**
  - Floor Number
  - Block Name
  - Total Units

- **Display:** Only shows floors for the selected block
- **Empty State:** Shows message if no block is selected

#### 3. Create Floor Dialog
**Fields:**
- **Society** (Required) - Dropdown to select society
- **Block** (Required) - Dropdown to select block (enabled after society selection)
- **Floor Number** (Required) - Numeric floor number (minimum: 1)
- **Total Units** (Optional) - Number of units on this floor (default: 0)

**Note:** 
- When creating a new floor, Society and Block can be selected directly in the dialog
- The "Add Floor" button is always enabled and accessible, regardless of filter selections
- **Edit functionality:** Currently, floor editing is not implemented in the UI. To modify a floor, you would need to delete and recreate it, or use the API directly

### Hierarchical Structure
```
Society
  └── Block
      └── Floor (this page)
          └── Unit
```

### API Endpoints Used
```javascript
// List societies (for dropdown)
GET /api/societies?limit=100

// List blocks (filtered by society)
GET /api/properties/blocks?society_id=123

// List floors (filtered by block)
GET /api/properties/floors?block_id=456

// Create floor
POST /api/properties/floors
Body: { block_id, floor_number, total_units }

// Update floor (backend supports this, but UI not implemented)
PUT /api/properties/floors/:id
Body: { floor_number, total_units }
// Note: block_id cannot be changed after creation
```

### Permissions
- **Create:** Only Super Admin (`requireRole('super_admin')`)
- **View:** All authenticated users can view floors

### Workflow
1. Select a **Society** from the first dropdown
2. Select a **Block** from the second dropdown (now enabled)
3. View floors for that block in the table
4. Click **"Add Floor"** to create a new floor
5. Enter floor number and total units
6. Save to create the floor

---

## Units Management

**Route:** `/super-admin/units`  
**Component:** `src/pages/super-admin/Units.jsx`

### Overview
Units represent individual apartments or residential units within a floor. This page allows Super Admins to create and manage units, which are the most granular level of the property hierarchy.

### Features

#### 1. Three-Level Hierarchical Selection
**Three cascading dropdowns:**
1. **Select Society** - Choose a society
2. **Select Block** - Choose a block (enabled after society selection)
3. **Select Floor** - Choose a floor (enabled after block selection)

**Cascading Behavior:**
- Selecting society loads blocks and resets block/floor selections
- Selecting block loads floors and resets floor selection
- Selecting floor shows units for that floor

#### 2. Search Functionality
- **Search Field:** Full-width search bar
- **Search Scope:** Searches across unit numbers, owner names, resident names
- **Real-time:** Updates results as you type

#### 3. Unit List Table
- **Columns:**
  - Unit Number
  - Block Name (shows "N/A" if block not assigned)
  - Floor Number (shows "N/A" if floor not assigned)
  - Owner Name (shows "-" if empty)
  - Resident Name (shows "-" if empty)
  - Contact Number (shows "-" if empty)
  - Email (shows "-" if empty)
  - Status (Occupied/Vacant) - Color-coded chip display (green for Occupied, gray for Vacant)
  - K-Electric Account (shows "-" if empty)
  - Gas Account (shows "-" if empty)
  - Water Account (shows "-" if empty)
  - Phone/TV Account (shows "-" if empty)
  - Car Info (displays as "Make/Model | License Plate | Number of Cars" or "-" if empty)
  - Bills (displays as "Tel: X, Other: Y" showing counts of telephone and other bills, or "-" if none)
  - Actions (Edit)

#### 4. Create Unit Dialog
**Fields:**

**Basic Information:**
- **Society** (Required) - Dropdown to select society
- **Block** (Required) - Dropdown to select block (enabled after society selection)
- **Floor** (Required) - Dropdown to select floor (enabled after block selection)
- **Unit Number** (Required) - Unit identifier (e.g., "101", "A-12")
- **Owner Name** (Optional) - Name of the unit owner
- **Resident Name** (Optional) - Name of the current resident
- **Contact Number** (Optional) - Phone number
- **Email** (Optional) - Email address

**Utility Accounts:**
- **K-Electric Account** (Optional) - K-Electric account number
- **Gas Account** (Optional) - Gas account number
- **Water Account** (Optional) - Water account number
- **Phone/TV Account** (Optional) - Phone/TV account number

**Vehicle Information:**
- **Car Make/Model** (Optional) - Vehicle make and model
- **License Plate** (Optional) - Vehicle license plate number
- **Number of Cars** (Optional) - Number of vehicles (default: 0)

**Status:**
- **Occupied Status** (Required) - Dropdown to select "Occupied" or "Vacant" (default: Vacant)

**Note:** When creating a new unit, all fields are available. Society, Block, and Floor can be selected directly in the dialog.

#### 5. Edit Unit
- Click the **Edit icon** on any unit row
- Opens dialog with pre-filled values for all fields
- **Note:** Society and Block selections are hidden when editing (to prevent data inconsistency)
- Floor selection is disabled when editing (shows current floor)
- All other fields can be updated:
  - Unit Number
  - Owner Name, Resident Name
  - Contact Number, Email
  - Utility Accounts (K-Electric, Gas, Water, Phone/TV)
  - Vehicle Information (Car Make/Model, License Plate, Number of Cars)
  - Occupied Status (Occupied/Vacant)
  - Telephone Bills and Other Bills (stored as JSONB arrays)

### Hierarchical Structure
```
Society
  └── Block
      └── Floor
          └── Unit (this page)
```

### API Endpoints Used
```javascript
// List societies (for dropdown)
GET /api/societies?limit=100

// List blocks (filtered by society)
GET /api/properties/blocks?society_id=123

// List floors (filtered by block)
GET /api/properties/floors?block_id=456

// List units (with filters and search)
GET /api/properties/units?society_id=123&block_id=456&floor_id=789&search=query

// Create unit
POST /api/properties/units
Body: { 
  society_apartment_id,      // Required
  block_id,                   // Optional
  floor_id,                   // Optional
  unit_number,                // Required
  owner_name,                 // Optional
  resident_name,              // Optional
  contact_number,             // Optional
  email,                      // Optional
  k_electric_account,         // Optional
  gas_account,                // Optional
  water_account,              // Optional
  phone_tv_account,           // Optional
  car_make_model,             // Optional
  license_plate,              // Optional
  number_of_cars,             // Optional (default: 0)
  is_occupied,                // Optional (default: false)
  telephone_bills,            // Optional (JSONB array)
  other_bills                 // Optional (JSONB array)
}

// Update unit
PUT /api/properties/units/:id
Body: { 
  unit_number,                // Optional (VARCHAR)
  owner_name,                 // Optional (VARCHAR, null if empty)
  resident_name,              // Optional (VARCHAR, null if empty)
  contact_number,             // Optional (VARCHAR, null if empty)
  email,                      // Optional (VARCHAR, null if empty)
  k_electric_account,         // Optional (VARCHAR, null if empty)
  gas_account,                // Optional (VARCHAR, null if empty)
  water_account,              // Optional (VARCHAR, null if empty)
  phone_tv_account,          // Optional (VARCHAR, null if empty)
  car_make_model,             // Optional (VARCHAR, null if empty)
  license_plate,              // Optional (VARCHAR, null if empty)
  number_of_cars,             // Optional (INTEGER, defaults to 0)
  is_occupied,                // Optional (BOOLEAN, defaults to false)
  telephone_bills,            // Optional (JSONB array, e.g., [{"provider": "PTCL", "account_number": "123", "amount": 1500}])
  other_bills                 // Optional (JSONB array, e.g., [{"type": "Internet", "provider": "PTCL", "amount": 2000}])
}
// Note: Only fields that are provided will be updated. Society, Block, and Floor cannot be changed after creation.
// The backend uses dynamic SQL with explicit type casting to handle all field types correctly.
```

### Permissions
- **Create:** Super Admin and Union Admin (`requireRole('super_admin', 'union_admin')`)
- **Update:** Super Admin and Union Admin (`requireRole('super_admin', 'union_admin')`)
- **View:** All authenticated users can view units

### Workflow
1. Select a **Society** from the first dropdown
2. Select a **Block** from the second dropdown
3. Select a **Floor** from the third dropdown
4. View units for that floor in the table
5. Use search to filter units by number, owner, or resident name
6. Click **"Add Unit"** to create a new unit
7. Fill in unit details and save

---

## Profile Management

**Route:** `/super-admin/profile`  
**Component:** `src/pages/super-admin/Profile.jsx`

### Overview
The Profile page allows Super Admins to view and edit their own account information and personal details. This is a dedicated page for managing your own profile, separate from the Users Management page where you manage other users.

### Features

#### 1. Profile Picture Section
**Features:**
- **Large Avatar Display** - Shows your profile picture (120x120px) or initials if no image
- **Upload Photo Button** - Click to select and upload a new profile picture
- **Change Photo Button** - Appears when you have a profile picture
- **Remove Button** - Remove your current profile picture
- **Image Preview** - See your selected image before saving
- **File Requirements:**
  - Format: JPG, PNG, or any image format
  - Maximum size: 2MB
  - Recommended: Square image for best display

**How to Upload:**
1. Click "Upload Photo" or "Change Photo" button
2. Select an image file from your device
3. The image will be previewed immediately
4. Click "Save Changes" to save the image
5. The image will be displayed in your profile and sidebar avatar

#### 2. Account Information Section
**Editable Fields:**
- **Name** (Required) - Your full name
- **Email** (Read-only) - Your email address (cannot be changed for security reasons)

**Display Only:**
- **Role** - Shows "Super Admin" badge (read-only)
- **Last Login** - Date and time of your last login (if available)
- **Account Created** - Date when your account was created (if available)

#### 3. Contact Information Section
**Editable Fields:**
- **Contact Number** (Optional) - Your primary phone number
- **Emergency Contact** (Optional) - Emergency contact phone number
- **CNIC** (Optional) - Your CNIC number

### Form Validation
- **Name:** Required field
- **Contact Number:** Optional, no format validation
- **Emergency Contact:** Optional, no format validation
- **CNIC:** Optional, no format validation

### How to Edit Your Profile

1. **Navigate to Profile:**
   - Click **"Profile"** from the Super Admin sidebar menu
   - Or go directly to `/super-admin/profile`

2. **Upload Profile Picture (Optional):**
   - Click **"Upload Photo"** or **"Change Photo"** button
   - Select an image file (JPG, PNG, max 2MB)
   - Preview will appear immediately
   - Click **"Remove"** to delete your current picture

3. **Update Information:**
   - Edit any of the editable fields (Name, Contact Number, Emergency Contact, CNIC)
   - Email and Role are displayed but cannot be changed

4. **Save Changes:**
   - Click the **"Save Changes"** button
   - A success message will confirm the update
   - Your profile information (including image) will be refreshed automatically
   - Your profile picture will appear in the sidebar avatar

### API Endpoint Used
```javascript
// Get current user profile
GET /api/auth/me
Response: { 
  id, email, name, role, 
  contact_number, emergency_contact, cnic,
  last_login, created_at 
}

// Update current user profile
PUT /api/auth/me
Content-Type: multipart/form-data (when uploading image) or application/json
Body: { 
  name,                    // Required
  contact_number,          // Optional
  emergency_contact,       // Optional
  cnic,                    // Optional
  profile_image            // Optional (File object, sent as FormData when uploading)
  remove_image             // Optional (set to 'true' to remove profile image)
}
Response: { 
  success: true,
  message: 'Profile updated successfully',
  data: { ...updated user data }
}
```

### Permissions
- **View:** All authenticated Super Admin users can view their own profile
- **Update:** All authenticated Super Admin users can update their own profile
- **Note:** Only the logged-in user can update their own profile via this endpoint

### Security Notes
- **Email Protection:** Email addresses cannot be changed through the profile page to prevent account hijacking
- **Role Protection:** Your role cannot be changed through the profile page
- **Self-Service:** This endpoint (`/auth/me`) only allows updating your own profile, not other users' profiles
- **Authentication Required:** All profile operations require a valid JWT token
- **Image Validation:** Profile images are validated for type (image files only) and size (max 2MB)
- **Image Storage:** Images are stored as files on the server filesystem (`backend/uploads/profiles/`) and only the file path is stored in the database (`users.profile_image` column). This approach is more efficient than storing base64 data in the database.
- **Image Serving:** Profile images are served as static files via `/uploads/profiles/{filename}` endpoint
- **Image Cleanup:** Old profile images are automatically deleted when a new image is uploaded or when the image is removed

### Differences from Users Management Page
| Feature | Profile Page | Users Management Page |
|---------|-------------|----------------------|
| **Purpose** | Edit your own details | Manage all users |
| **Access** | Your own profile only | All users in the system |
| **Email Editing** | Not allowed | Allowed (for other users) |
| **Role Editing** | Not allowed | Allowed (for other users) |
| **Password Change** | Not available here | Available via Users page |
| **User Creation** | Not available | Available |
| **Profile Image** | ✅ Available | Not available |
| **Sidebar Avatar** | ✅ Uses your profile image | Uses initials |

### Workflow
1. Navigate to **Profile** from the sidebar
2. View your current account and contact information
3. Edit any editable fields as needed
4. Click **"Save Changes"** to update your profile
5. Confirm the success message
6. Your changes are immediately reflected

---

## Users Management

**Route:** `/super-admin/users`  
**Component:** `src/pages/admin/Users.jsx`

### Overview
The Users Management page allows Super Admins to create, view, edit, and manage all users in the system, including other Super Admins, Union Admins, Residents, and Staff members.

### Features

#### 1. User List Table
- **Columns:**
  - Name
  - Email
  - Role (with color-coded chips: Super Admin=red, Union Admin=blue, Resident=green, Staff=orange)
  - Society (visible only to Super Admin) - Shows society name or "-" if not assigned
  - Status (Active/Inactive)
  - Actions (Change Password, Edit, Delete)

#### 2. Search Functionality
- **Search Field:** Full-width search bar at the top
- **Search Scope:** Searches across user name and email
- **Real-time:** Updates results as you type

#### 3. Role Filter
- **Dropdown:** Filter users by role
- **Options:** All Roles, Super Admin, Union Admin, Resident, Staff
- **Purpose:** Quickly view users of a specific role

#### 4. Pagination
- **Default:** 10 items per page
- **Controls:** Page navigation and rows per page selector
- **Data Source:** Paginated API response

#### 5. Create User Dialog
**Fields:**

**Basic Information:**
- **Name** (Required) - User's full name
- **Email** (Required) - Unique email address
- **Password** (Required for new users only) - Minimum 6 characters
- **Role** (Required) - Select from:
  - Super Admin (only visible to Super Admins)
  - Union Admin
  - Resident
  - Staff

**Society & Unit Assignment:**
- **Society** (Required for Union Admin, Resident, Staff) - Dropdown to select society
  - Super Admins can select any society
  - Union Admins see only their assigned society (disabled, auto-filled)
- **Unit** (Optional, only for Resident role) - Dropdown to select unit
  - Only enabled when Society is selected and Role is "Resident"
  - Shows units filtered by selected society

**Contact Information:**
- **Contact Number** (Optional) - Primary phone number
- **Emergency Contact** (Optional) - Emergency contact phone number
- **CNIC** (Optional) - CNIC number

**Status:**
- **Status** (Only when editing) - Active or Inactive toggle

**Validation:**
- Email must be valid and unique
- Name is required
- Password required for new users only (minimum 6 characters)
- Role is required
- Society is required for Union Admin, Resident, and Staff roles
- Unit is optional (only applicable for Resident role)
- Contact Number, Emergency Contact, and CNIC are optional

#### 6. Edit User
- Click the **Edit icon** (pencil) on any user row
- Opens dialog with pre-filled values
- **Note:** Email cannot be changed after creation (field is disabled)
- Can update:
  - Name
  - Role (with society/unit validation)
  - Society (for Union Admin, Resident, Staff - Super Admin can change)
  - Unit (for Resident role only)
  - Contact Number, Emergency Contact, CNIC
  - Active/Inactive status
- **Note:** When editing, Society field behavior:
  - Super Admin editing: Can change society for any user
  - Union Admin editing: Society is disabled (shows their own society)

#### 7. Change Password
- Click the **Lock icon** on any user row
- Opens password change dialog
- Enter new password (minimum 6 characters)
- Updates user's password immediately

#### 8. Delete User
- Click the **Delete icon** (trash) on any user row
- Confirmation dialog appears
- **Restriction:** Cannot delete your own account
- **Warning:** Deleting a user may affect related data (complaints, maintenance records, etc.)

### Super Admin Exclusive Capabilities

Super Admins have exclusive privileges when managing users:

1. **Create Super Admin Users:**
   - Only Super Admins can see the "Super Admin" option in the role dropdown
   - Can create new Super Admin accounts
   - Union Admins cannot create Super Admin users

2. **Delete Any User:**
   - Super Admins can delete any user (except themselves)
   - Union Admins have limited deletion capabilities

3. **View All Users:**
   - Can see users from all societies
   - Not restricted to a specific society
   - Can see Society column in the users table (Union Admins cannot see this column)

### API Endpoints Used
```javascript
// List users (with pagination, search, and role filter)
GET /api/users?page=1&limit=10&search=query&role=super_admin

// Get user by ID
GET /api/users/:id

// Create user
POST /api/auth/register
Body: { email, password, name, role, ... }

// Update user
PUT /api/users/:id
Body: { name, role, is_active, ... }

// Update password
PATCH /api/users/:id/password
Body: { new_password }

// Delete user
DELETE /api/users/:id
```

### Permissions
- **View:** Super Admin and Union Admin (`requireRole('super_admin', 'union_admin')`)
- **Create:** Super Admin and Union Admin (`requireRole('super_admin', 'union_admin')`)
- **Update:** Super Admin and Union Admin (`requireRole('super_admin', 'union_admin')`)
- **Delete:** Only Super Admin (`requireRole('super_admin')`)
- **Create Super Admin:** Only Super Admin (frontend restriction)

### User Roles Available

| Role | Code | Can Create | Description |
|------|------|------------|-------------|
| **Super Admin** | `super_admin` | ✅ Super Admin only | System-wide access, can manage all societies |
| **Union Admin** | `union_admin` | ✅ Super Admin, Union Admin | Society-specific admin, manages one society |
| **Resident** | `resident` | ✅ Super Admin, Union Admin | Regular resident user |
| **Staff** | `staff` | ✅ Super Admin, Union Admin | Staff member for complaint handling |

### Workflow

#### Creating a New User
1. Navigate to **Users** from the Super Admin sidebar
2. Click **"Add User"** button
3. Fill in required fields:
   - Name
   - Email (must be unique)
   - Password (minimum 6 characters)
   - Role (select from dropdown - Super Admin option only visible to Super Admins)
   - Society (required for Union Admin, Resident, Staff roles)
   - Unit (optional, only for Resident role - select after choosing Society)
4. Optionally fill in:
   - Contact Number
   - Emergency Contact
   - CNIC
5. Click **"Create"**
6. User is created and appears in the list

#### Editing a User
1. Click the **Edit icon** on the user row
2. Modify any editable fields:
   - Name
   - Role (with automatic society/unit validation)
   - Society (for Union Admin, Resident, Staff - Super Admin can change)
   - Unit (for Resident role only)
   - Contact Number, Emergency Contact, CNIC
   - Active/Inactive status
3. **Note:** Email cannot be changed (field is disabled)
4. Click **"Update"**
5. Changes are saved immediately

#### Changing User Password
1. Click the **Lock icon** on the user row
2. Enter new password
3. Click **"Update Password"**
4. Password is updated (user will need to use new password on next login)

#### Deleting a User
1. Click the **Delete icon** on the user row
2. Confirm deletion in the dialog
3. User is removed from the system
4. **Note:** Cannot delete your own account

### Security Considerations

1. **Role-Based Access:**
   - Only Super Admins can create Super Admin users
   - Union Admins can create Union Admin, Resident, and Staff users
   - Frontend hides Super Admin option from non-Super Admin users

2. **Password Security:**
   - Passwords are hashed with bcrypt (10 rounds)
   - Minimum 6 characters required
   - Passwords never displayed or returned in API responses

3. **Email Uniqueness:**
   - Email addresses must be unique across all users
   - Cannot change email after user creation
   - System validates uniqueness before creating user

4. **Self-Protection:**
   - Users cannot delete their own account
   - Prevents accidental account deletion

---

## Global Reports

**Route:** `/super-admin/reports`  
**Component:** `src/pages/super-admin/GlobalReports.jsx`

### Overview
Global Reports provides cross-society analytics and financial summaries. This is an exclusive Super Admin feature that aggregates data from all societies in the system.

### Features

#### 1. Year Filter
- **Dropdown:** Select year for reports
- **Default:** Current year
- **Options:** Current year and 5 years back (6 total years)
- **Purpose:** Filter financial and complaint data by year

#### 2. Summary Cards
Four key metric cards:

- **Total Income**
  - Icon: TrendingUpIcon (Success color)
  - Shows: Sum of all income transactions across all societies
  - Format: Currency (PKR)

- **Total Expenses**
  - Icon: TrendingDownIcon (Error color)
  - Shows: Sum of all expense transactions across all societies
  - Format: Currency (PKR)

- **Net Income**
  - Icon: AccountBalanceIcon (Primary color)
  - Shows: Total Income - Total Expenses
  - Format: Currency (PKR)

- **Total Complaints**
  - Icon: AssignmentIcon (Warning color)
  - Shows: Count of all complaints across all societies
  - Format: Number

#### 3. Financial Summary by Society Chart
- **Chart Type:** Bar Chart
- **Title:** "Income by Society"
- **X-Axis:** Society names
- **Y-Axis:** Income amount (PKR)
- **Purpose:** Compare income across different societies
- **Data:** `reports.society_financials` array

#### 4. Complaint Statistics Chart
- **Chart Type:** Pie Chart
- **Title:** "Complaints by Status"
- **Categories:**
  - Pending
  - Resolved
  - In Progress
  - Closed
- **Purpose:** Visual breakdown of complaint statuses system-wide
- **Data:** `reports.complaint_statistics` object

#### 5. Society-wise Breakdown Section
- **Layout:** Grid of cards (3 columns on large screens)
- **Information per Society:**
  - Society name
  - Income (PKR)
  - Expenses (PKR)
  - Net Income (PKR)
  - Total Complaints count
- **Purpose:** Detailed breakdown for each society

#### 6. Error Handling
- **Error Alert:** Displays if API call fails
- **Empty State:** Shows message if no data available for selected year
- **Loading State:** CircularProgress spinner while loading

### API Endpoints Used
```javascript
// Get global reports
GET /api/super-admin/reports/global?year=2026

// Response Structure:
{
  success: true,
  data: {
    financial: {
      total_societies: number,
      total_income: string,
      total_expenses: string,
      net_income: string
    },
    complaints: {
      total_complaints: number,
      societies_with_complaints: number,
      pending: number,
      resolved: number,
      in_progress: number,
      closed: number
    },
    societyBreakdown: [
      {
        id: number,
        name: string,
        total_units: number,
        total_complaints: number,
        income: string,
        expenses: string
      }
    ]
  }
}
```

### Permissions
- **Access:** Only Super Admin (`requireRole('super_admin')`)
- **Backend Route:** `backend/routes/superAdmin.js`
- **Controller:** `backend/controllers/superAdminController.js`

### Data Aggregation
The backend aggregates data from multiple tables:
- **Finance Table:** Income and expense transactions
- **Complaints Table:** Complaint counts and statuses
- **Societies Table:** Society information
- **Units Table:** Unit counts per society

---

## Creating New Super Admin Users

### Can New Super Admins Be Created?

**Yes**, new Super Admin users can be created, but with restrictions:

### Method 1: Through Users Management Page (Recommended)
Super Admins have direct access to the Users management page via the sidebar:

1. Navigate to **Users** from the Super Admin sidebar menu (`/super-admin/users`)
2. Click **"Add User"** button
3. Fill in user details:
   - Name
   - Email
   - Password
   - **Role:** Select "Super Admin" (only visible to Super Admins)
4. Click **"Create"**

**Note:** The Users page is accessible directly from the Super Admin sidebar, making it easy to manage all users including creating new Super Admin accounts.

### Method 2: Through API Endpoint (Direct)
Super Admins can create new users (including Super Admins) via the registration API:

```javascript
POST /api/auth/register
Headers: {
  Authorization: "Bearer <super_admin_token>"
}
Body: {
  email: "newadmin@example.com",
  password: "securepassword123",
  name: "New Super Admin",
  role: "super_admin"
}
```

**Requirements:**
- Must be authenticated as Super Admin
- Endpoint requires `requireRole('super_admin', 'union_admin')`
- Only Super Admins can create Super Admin users (Union Admins cannot)

### Method 3: Database Seed Script
During initial setup, Super Admin users are created via the seed script:

```bash
cd backend
npm run seed
```

This creates:
- **Email:** `admin@homelandunion.com`
- **Password:** `admin123`
- **Role:** `super_admin`

### Method 4: Direct Database Insert (Not Recommended)
Super Admin users can be inserted directly into the database, but this is **not recommended** for production:

```sql
INSERT INTO users (email, password, name, role, is_active)
VALUES (
  'newadmin@example.com',
  '$2a$10$hashed_password_here',  -- Must be bcrypt hashed
  'New Super Admin',
  'super_admin',
  true
);
```

### Security Considerations

1. **Limited Creation:** Only existing Super Admins can create new Super Admin users
2. **Password Hashing:** Passwords must be bcrypt hashed (10 rounds)
3. **Email Uniqueness:** Email addresses must be unique across all users
4. **Active Status:** New users are created with `is_active = true` by default
5. **Created By Tracking:** The `created_by` field tracks which user created the new user

### User Management Capabilities

Super Admins can:
- ✅ Create users of **any role** (Super Admin, Union Admin, Resident, Staff)
- ✅ Update user information (name, role, active status)
- ✅ Change user passwords
- ✅ Delete users (except themselves)
- ✅ View all users in the system

**API Endpoints:**
```javascript
// List all users
GET /api/users?page=1&limit=10&search=query&role=super_admin

// Get user by ID
GET /api/users/:id

// Create user
POST /api/auth/register
Body: { email, password, name, role, ... }

// Update user
PUT /api/users/:id
Body: { name, role, is_active, ... }

// Update password
PATCH /api/users/:id/password
Body: { new_password }

// Delete user
DELETE /api/users/:id
```

### Restrictions

- **Self-Deletion:** Super Admins cannot delete their own account
- **Role Assignment:** Union Admins cannot create Super Admin users (only Super Admins can)
- **Email Changes:** Email addresses cannot be changed after user creation (disabled in edit form)

---

## API Endpoints

### Super Admin Exclusive Endpoints

#### 1. Global Reports
```http
GET /api/super-admin/reports/global?year=2026
Authorization: Bearer <super_admin_token>
```

#### 2. Societies Management
```http
# Create Society
POST /api/societies
Authorization: Bearer <super_admin_token>
Body: { name, address, city, total_blocks, total_units }

# Update Society
PUT /api/societies/:id
Authorization: Bearer <super_admin_token>
Body: { name, address, city, total_blocks, total_units }

# Delete Society
DELETE /api/societies/:id
Authorization: Bearer <super_admin_token>
```

#### 3. Blocks Management
```http
# Create Block
POST /api/properties/blocks
Authorization: Bearer <super_admin_token>
Body: { society_apartment_id, name, total_floors, total_units }
```

#### 4. Floors Management
```http
# Create Floor
POST /api/properties/floors
Authorization: Bearer <super_admin_token>
Body: { block_id, floor_number, total_units }
```

#### 5. Units Management
```http
# Create Unit
POST /api/properties/units
Authorization: Bearer <super_admin_token>
Body: { 
  society_apartment_id,      // Required
  block_id,                   // Optional
  floor_id,                   // Optional
  unit_number,                // Required
  owner_name,                 // Optional
  resident_name,              // Optional
  contact_number,             // Optional
  email,                      // Optional
  k_electric_account,         // Optional
  gas_account,                // Optional
  water_account,              // Optional
  phone_tv_account,           // Optional
  car_make_model,             // Optional
  license_plate,              // Optional
  number_of_cars,             // Optional (default: 0)
  is_occupied,                // Optional (default: false)
  telephone_bills,            // Optional (JSONB array)
  other_bills                 // Optional (JSONB array)
}

# Update Unit
PUT /api/properties/units/:id
Authorization: Bearer <super_admin_token>
Body: { 
  unit_number,                // Optional
  owner_name,                 // Optional
  resident_name,              // Optional
  contact_number,             // Optional
  email,                      // Optional
  k_electric_account,         // Optional
  gas_account,                // Optional
  water_account,              // Optional
  phone_tv_account,          // Optional
  car_make_model,             // Optional
  license_plate,              // Optional
  number_of_cars,             // Optional
  is_occupied,                // Optional (boolean)
  telephone_bills,            // Optional (JSONB array)
  other_bills                 // Optional (JSONB array)
}
```

#### 6. User Management
```http
# List Users
GET /api/users?page=1&limit=10&search=query&role=super_admin
Authorization: Bearer <super_admin_token>

# Get User by ID
GET /api/users/:id
Authorization: Bearer <super_admin_token>

# Create User (including Super Admin)
POST /api/auth/register
Authorization: Bearer <super_admin_token>
Body: { email, password, name, role: "super_admin", ... }

# Update User
PUT /api/users/:id
Authorization: Bearer <super_admin_token>
Body: { name, role, is_active, ... }

# Update User Password
PATCH /api/users/:id/password
Authorization: Bearer <super_admin_token>
Body: { new_password }

# Delete User
DELETE /api/users/:id
Authorization: Bearer <super_admin_token>
```

### Shared Endpoints (Super Admin + Union Admin)

Super Admins also have access to endpoints shared with Union Admins:
- Units Management (Create/Update)
- Finance Management
- Maintenance Management
- Complaints Management
- Announcements Management
- Residents Management
- Settings Management

---

## Security & Permissions

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Token Location:** `Authorization: Bearer <token>` header
- **Token Expiry:** 15 minutes (access token), 7 days (refresh token)
- **Refresh:** Automatic via httpOnly cookie

### Authorization Middleware

#### Backend Protection
Routes are protected using middleware in `backend/middleware/auth.js`:

```javascript
// Authentication required
router.use(authenticate);

// Role-based access
router.get('/reports/global', requireRole('super_admin'), controller.getGlobalReports);
```

#### Frontend Protection
Routes are protected using `ProtectedRoute` component:

```javascript
<ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
  <MainLayout>
    {/* Super Admin routes */}
  </MainLayout>
</ProtectedRoute>
```

### Role Hierarchy

```
Super Admin (Highest)
    ↓
Union Admin
    ↓
Staff
    ↓
Resident (Lowest)
```

### Permission Matrix

| Feature | Super Admin | Union Admin | Staff | Resident |
|---------|-------------|-------------|-------|----------|
| View Global Reports | ✅ | ❌ | ❌ | ❌ |
| Create/Delete Societies | ✅ | ❌ | ❌ | ❌ |
| Create Blocks/Floors | ✅ | ❌ | ❌ | ❌ |
| Create/Update Units | ✅ | ✅ | ❌ | ❌ |
| Manage Users (All Roles) | ✅ | ✅** | ❌ | ❌ |
| Create Super Admin Users | ✅ | ❌ | ❌ | ❌ |
| Create Union Admin Users | ✅ | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ |
| View All Societies | ✅ | ❌ | ❌ | ❌ |
| Manage Finance | ✅ | ✅ | ❌ | ❌ |
| Manage Complaints | ✅ | ✅ | ✅* | ❌ |
| View Own Data | ✅ | ✅ | ✅ | ✅ |

*Staff can only add progress updates to assigned complaints  
**Union Admins can manage users but cannot create Super Admins or delete users

*Staff can only add progress updates to assigned complaints

### Security Best Practices

1. **Token Security:**
   - Tokens stored in memory (not localStorage for sensitive operations)
   - Refresh tokens in httpOnly cookies
   - Automatic token refresh before expiry

2. **Password Security:**
   - Passwords hashed with bcrypt (10 rounds)
   - Minimum 6 characters required
   - Passwords never returned in API responses

3. **Role Validation:**
   - Backend validates role on every request
   - Frontend role checks are for UX only (not security)
   - Database constraints enforce role values

4. **Data Access:**
   - Super Admins can access all data (no society restriction)
   - Union Admins restricted to their society
   - Residents restricted to their unit

---

## Additional Resources

### Related Documentation
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Database Setup](./database/DATABASE_SETUP.md)
- [Quick Start Guide](./QUICK_START.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

### Code References
- **Frontend Routes:** `src/routes/index.jsx`
- **Super Admin Pages:** `src/pages/super-admin/`
- **API Services:** `src/api/superAdminApi.js`
- **Backend Routes:** `backend/routes/superAdmin.js`
- **Backend Controller:** `backend/controllers/superAdminController.js`
- **Auth Middleware:** `backend/middleware/auth.js`

### Test Credentials
```
Super Admin:
Email: admin@homelandunion.com
Password: admin123
```

---

## Troubleshooting

### Common Issues

#### 1. Cannot Access Super Admin Routes
**Problem:** Redirected to login or getting 403 error

**Solutions:**
- Verify user role is `super_admin` in database
- Check JWT token is valid and not expired
- Ensure token is sent in `Authorization: Bearer <token>` header
- Verify backend middleware is correctly configured

#### 2. Cannot Create New Super Admin
**Problem:** "Insufficient permissions" error

**Solutions:**
- Ensure current user is authenticated as Super Admin
- Check that `requireRole('super_admin')` is applied to registration endpoint
- Verify user has `is_active = true` in database

#### 3. Global Reports Show No Data
**Problem:** Empty charts and zero values

**Solutions:**
- Check if societies have financial transactions for selected year
- Verify complaints exist in the database
- Check backend query logs for errors
- Ensure year filter matches data year

#### 4. Cannot Delete Society
**Problem:** Delete button doesn't work or shows error

**Solutions:**
- Check if society has associated blocks/floors/units (may need cascade delete)
- Verify database foreign key constraints
- Check backend error logs
- Ensure user has Super Admin role

---

## Summary

The Super Admin role provides comprehensive system-wide management capabilities:

✅ **Property Management:** Create and manage societies, blocks, floors, and units  
✅ **User Management:** Create, edit, and delete users of all roles (Super Admin, Union Admin, Resident, Staff) via the Users page  
✅ **Global Analytics:** View cross-society reports and financial summaries  
✅ **System Configuration:** Full administrative control over the platform  

Super Admins are the foundation of the system setup and have exclusive privileges to:
- Manage the entire property hierarchy (Society → Block → Floor → Unit)
- Create other Super Admin users
- Delete any user in the system
- Access cross-society analytics and reports

The Users Management page (`/super-admin/users`) is directly accessible from the Super Admin sidebar, providing an intuitive interface for managing all system users.

---

---

## Known Issues & Limitations

### Current Implementation Status

1. **Floors Management - Edit Functionality:**
   - ❌ Floor editing is not implemented in the UI
   - ✅ Backend API supports floor updates (`PUT /api/properties/floors/:id`)
   - **Workaround:** Use API directly or delete and recreate floors

2. **Blocks Management - Society Column:**
   - ✅ Backend returns `society_name` field in blocks list
   - ✅ Frontend displays society name correctly
   - **Note:** If "N/A" appears, it means the block's `society_apartment_id` is NULL or the society was deleted

3. **Floors Management - Block Column:**
   - ✅ Backend returns `block_name` field in floors list
   - ✅ Frontend displays block name correctly
   - **Note:** If "N/A" appears, it means the floor's `block_id` is NULL or the block was deleted

4. **Units Management - Edit Unit Error:**
   - ⚠️ There was a known issue with "could not determine data type of parameter $16" error
   - ✅ Backend uses dynamic SQL with explicit type casting to resolve this
   - **Note:** All unit fields are properly typed (VARCHAR, INTEGER, BOOLEAN, JSONB)

5. **Add Floor/Add Units Buttons:**
   - ✅ "Add Floor" button is always enabled and functional
   - ✅ "Add Unit" button is always enabled and functional
   - **Note:** These buttons work regardless of filter selections

### Future Enhancements

1. **Floors Management:**
   - Add Edit Floor functionality in the UI
   - Add Delete Floor functionality

2. **Blocks Management:**
   - Add Delete Block functionality (currently only Edit is available)

3. **Units Management:**
   - Add Delete Unit functionality
   - Add bulk import/export functionality
   - Add advanced filtering options

4. **Users Management:**
   - Add bulk user creation
   - Add user import from CSV/Excel
   - Add user activity logs

---

**Last Updated:** January 27, 2026  
**Version:** 1.1.0