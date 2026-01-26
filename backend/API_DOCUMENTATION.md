# Homeland Union API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/login`
Login and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "jwt_token_here"
  }
}
```

### POST `/api/auth/register`
Register a new user (Super Admin/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "resident",
  "society_apartment_id": 1,
  "unit_id": 1
}
```

### GET `/api/auth/me`
Get current user information.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### POST `/api/auth/logout`
Logout user.

---

## 🏢 Societies Endpoints

### GET `/api/societies`
Get all societies (with pagination and search).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Search by name, address, or city

**Headers:** `Authorization: Bearer <token>`

### GET `/api/societies/:id`
Get society by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/societies`
Create new society (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Green Valley Society",
  "address": "123 Main St",
  "city": "Karachi",
  "total_blocks": 5,
  "total_units": 100
}
```

### PUT `/api/societies/:id`
Update society (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

### DELETE `/api/societies/:id`
Delete society (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 👥 Residents Endpoints

### GET `/api/residents`
Get all residents (with pagination and filters).

**Query Parameters:**
- `page`, `limit`
- `society_id` - Filter by society
- `unit_id` - Filter by unit
- `search` - Search by name, email, or contact

**Headers:** `Authorization: Bearer <token>`

### GET `/api/residents/:id`
Get resident by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/residents`
Create new resident (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "resident@example.com",
  "password": "password123",
  "name": "John Doe",
  "society_apartment_id": 1,
  "unit_id": 1,
  "cnic": "12345-1234567-1",
  "contact_number": "03001234567"
}
```

### PUT `/api/residents/:id`
Update resident (Admin only).

**Headers:** `Authorization: Bearer <token>`

### DELETE `/api/residents/:id`
Delete resident (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 💰 Maintenance Endpoints

### GET `/api/maintenance`
Get all maintenance records.

**Query Parameters:**
- `page`, `limit`
- `society_id`, `unit_id`
- `status` - Filter by status (pending, paid, partially_paid)
- `month`, `year` - Filter by month/year

**Headers:** `Authorization: Bearer <token>`

### GET `/api/maintenance/:id`
Get maintenance record by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/maintenance`
Create maintenance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "unit_id": 1,
  "society_apartment_id": 1,
  "month": 1,
  "year": 2026,
  "base_amount": 5000,
  "total_amount": 5500,
  "due_date": "2026-02-01"
}
```

### PUT `/api/maintenance/:id`
Update maintenance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

### POST `/api/maintenance/:id/payment`
Record payment for maintenance.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount_paid": 5500,
  "payment_method": "bank_transfer"
}
```

### DELETE `/api/maintenance/:id`
Delete maintenance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 💵 Finance Endpoints

### GET `/api/finance`
Get all finance records.

**Query Parameters:**
- `page`, `limit`
- `society_id`
- `transaction_type` - income or expense
- `month`, `year`

**Headers:** `Authorization: Bearer <token>`

### GET `/api/finance/summary`
Get finance summary (totals, balance).

**Query Parameters:**
- `society_id`
- `month`, `year`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "income": 100000,
    "expense": 75000,
    "balance": 25000,
    "income_count": 10,
    "expense_count": 5
  }
}
```

### GET `/api/finance/:id`
Get finance record by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/finance`
Create finance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "society_apartment_id": 1,
  "transaction_date": "2026-01-26",
  "transaction_type": "expense",
  "expense_type": "maintenance",
  "description": "Building repairs",
  "amount": 50000,
  "payment_mode": "bank_transfer"
}
```

### PUT `/api/finance/:id`
Update finance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

### DELETE `/api/finance/:id`
Delete finance record (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 📝 Complaints Endpoints

### GET `/api/complaints`
Get all complaints.

**Query Parameters:**
- `page`, `limit`
- `society_id`, `status`, `priority`, `assigned_to`

**Note:** Residents can only see their own complaints.

**Headers:** `Authorization: Bearer <token>`

### GET `/api/complaints/:id`
Get complaint by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/complaints`
Submit a complaint (Any authenticated user).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "society_apartment_id": 1,
  "unit_id": 1,
  "title": "Water leakage issue",
  "description": "Water is leaking from the ceiling",
  "priority": "high"
}
```

### PUT `/api/complaints/:id`
Update complaint.

**Note:** Residents can only update their own complaints (limited fields).

**Headers:** `Authorization: Bearer <token>`

### PATCH `/api/complaints/:id/status`
Update complaint status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "in_progress"
}
```

### DELETE `/api/complaints/:id`
Delete complaint.

**Note:** Residents can only delete their own complaints.

**Headers:** `Authorization: Bearer <token>`

---

## ⚠️ Defaulters Endpoints

### GET `/api/defaulters`
Get all defaulters.

**Query Parameters:**
- `page`, `limit`
- `society_id`, `status`

**Headers:** `Authorization: Bearer <token>`

### GET `/api/defaulters/statistics`
Get defaulter statistics.

**Query Parameters:**
- `society_id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_defaulters": 10,
    "total_amount_due": 55000,
    "avg_days_overdue": 45,
    "active_count": 8,
    "resolved_count": 2
  }
}
```

### PATCH `/api/defaulters/:id/status`
Update defaulter status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "resolved"
}
```

---

## 📢 Announcements Endpoints

### GET `/api/announcements`
Get all announcements.

**Query Parameters:**
- `page`, `limit`
- `society_id`, `type`, `is_active`

**Headers:** `Authorization: Bearer <token>`

### GET `/api/announcements/:id`
Get announcement by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/announcements`
Create announcement (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Monthly Meeting",
  "description": "Monthly society meeting on 30th",
  "type": "event",
  "society_apartment_id": 1,
  "visible_to_all": true
}
```

### PUT `/api/announcements/:id`
Update announcement (Admin only).

**Headers:** `Authorization: Bearer <token>`

### DELETE `/api/announcements/:id`
Delete announcement (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 🏗️ Properties Endpoints (Blocks, Floors, Units)

### GET `/api/properties/blocks`
Get all blocks for a society.

**Query Parameters:**
- `society_id` (required)

**Headers:** `Authorization: Bearer <token>`

### POST `/api/properties/blocks`
Create block (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "society_apartment_id": 1,
  "name": "Block A",
  "total_floors": 5,
  "total_units": 20
}
```

### GET `/api/properties/floors`
Get all floors for a block.

**Query Parameters:**
- `block_id` (required)

**Headers:** `Authorization: Bearer <token>`

### POST `/api/properties/floors`
Create floor (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "block_id": 1,
  "floor_number": 1,
  "total_units": 4
}
```

### GET `/api/properties/units`
Get all units.

**Query Parameters:**
- `society_id`, `block_id`, `floor_id`, `is_occupied`

**Headers:** `Authorization: Bearer <token>`

### GET `/api/properties/units/:id`
Get unit by ID.

**Headers:** `Authorization: Bearer <token>`

### POST `/api/properties/units`
Create unit (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "society_apartment_id": 1,
  "block_id": 1,
  "floor_id": 1,
  "unit_number": "A-101",
  "owner_name": "John Doe"
}
```

### PUT `/api/properties/units/:id`
Update unit (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 👤 Users Endpoints

### GET `/api/users`
Get all users (Super Admin only).

**Query Parameters:**
- `page`, `limit`, `role`, `search`

**Headers:** `Authorization: Bearer <token>`

### GET `/api/users/:id`
Get user by ID (Admin only).

**Headers:** `Authorization: Bearer <token>`

### PUT `/api/users/:id`
Update user (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

### PATCH `/api/users/:id/password`
Update user password (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "new_password": "newpassword123"
}
```

### DELETE `/api/users/:id`
Delete user (Super Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## 🧪 Test Endpoints

### GET `/api/test/db`
Test database connection.

### GET `/api/test/tables`
Get all database tables.

### GET `/api/test/societies`
Test societies query.

### GET `/api/test/users`
Test users query.

---

## 📊 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development)"
}
```

**Pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔒 Role-Based Access

- **Super Admin**: Full access to all endpoints
- **Union Admin**: Access to society-specific management
- **Resident**: Limited access (own data, submit complaints)

---

## 📝 Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- All timestamps are in UTC
- Pagination defaults: page=1, limit=10
- Search is case-insensitive
- All monetary amounts are in decimal format
