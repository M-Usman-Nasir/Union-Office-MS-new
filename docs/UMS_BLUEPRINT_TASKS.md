# UMS Blueprint – Task Checklist

Use this list to track progress. **Checked [x] = already in your current system.** Unchecked [ ] = to do; tick when complete.

*Aligned with the HUMS repo: backend routes/controllers, migrations (e.g. 033 union approval, 034 global settings, 035 union features, 036 audit_log, 041 scheduled announcements, 044–046 soft-delete / essentials).*

---

## 1. Core System Architecture

### Backend
- [x] Node.js + Express.js
- [x] PostgreSQL (primary database)
- [ ] Redis (sessions, OTPs, caching, queues)
- [x] REST API
- [x] JWT + Refresh Tokens
- [ ] RBAC with full permission matrix (partial: `role_permissions` + `requirePermission` on users/finance/complaints/maintenance/properties/announcements; super-admin permission APIs; optional rows per role—no UI editor yet)

### Frontend
- [x] Web: React
- [x] Mobile: React Native (resident app)
- [x] Shared API layer (same backend for web + mobile)

### Infrastructure
- [ ] Dockerized services
- [ ] NGINX (reverse proxy)
- [ ] Cloud deployment (AWS / DigitalOcean / Hetzner)
- [ ] CI/CD pipeline
- [x] Database backup & restore scripts (`npm run backup:db` / `restore:db` in backend—schedule on host or CI)

---

## 2. User Roles & Authority Model

### Super Admin (Platform Owner)
- [x] Create unions (apartments)
- [x] Formal approve workflow for unions (`PATCH /api/societies/:id/approve` & reject; `approval_status`; union_admin login blocked until approved)
- [x] Create Union Admin accounts
- [x] View system-wide analytics
- [x] Manage subscriptions & billing (basic)
- [x] Control global settings (`GET`/`PUT /api/settings/global`, super admin)
- [x] Enable/disable features per union (`union_features`; super-admin APIs on apartment)
- [x] System audit logs (audit_log table + service + super-admin viewer endpoint/UI)
- [x] Resolve disputes & escalations (`GET`/`PATCH /api/super-admin/escalations…`)

### Union Admin (Local Union Authority)
- [x] Manage residents
- [x] Manage staff (guards, maintenance)
- [x] Manage finances
- [x] Post announcements
- [x] Handle complaints
- [x] Generate official reports
- [x] Messaging with residents

### Resident (End User)
- [x] View bills
- [ ] Full pay-dues flow (currently payment recording only)
- [x] Submit complaints
- [x] View announcements
- [x] Track service requests (complaints)
- [x] Receive notifications

---

## 3. Authentication & Security

### Authentication
- [ ] CNIC-based identity (masked/encrypted storage)
- [ ] Mobile number verification (OTP)
- [x] Email login
- [ ] Password + OTP (2FA optional)
- [x] Device-based login (mobile app)

### Authorization
- [ ] RBAC with permission matrix (partial: same as §1 backend—DB + middleware + APIs; not full coverage of every route)
- [x] Union-scoped access
- [ ] Row-level security in PostgreSQL

### Security Measures
- [x] Rate limiting – Phase 1 (auth endpoints: login, refresh, resident registration, password-change routes)
- [ ] Rate limiting – Phase 2 (global API limits + stricter limits on high-risk endpoints as traffic grows)
- [ ] IP blocking
- [ ] Encrypted sensitive fields (CNIC etc.; passwords already hashed)
- [ ] Audit trails for all admin actions (partial `audit_log`: apartments, global settings, escalations resolve, users, finance; other modules use `activity_timeline` for many mutations)
- [ ] GDPR-style data control

---

## 4. Union & Property Management

### Union Setup
- [x] Union profile (name, address, city, area)
- [x] Location: City
- [ ] Location: District, UC

### Property Management
- [x] Units (houses/flats/shops – no type field yet)
- [x] Blocks / Streets / Sectors (blocks, floors)
- [ ] Property status: active, vacant, disputed (currently is_occupied only)

---

## 5. Resident Management
- [x] Resident profiles (name, contact, unit, move-in, profile image)
- [x] Family members (admin CRUD: `/api/residents/:id/family-members`)
- [ ] CNIC (encrypted / masked)
- [ ] Full move-in / move-out tracking (currently move_in_date only)
- [ ] Blacklist / violation history

---

## 6. Financial Management

### Dues & Billing
- [x] Monthly maintenance fees
- [x] Auto-generated invoices (partial: **platform** subscription invoices for union admins—auto-generate API/job + `super_admin_invoices`; not per-resident PDF invoices)
- [ ] PDF receipts

### Payments
- [x] Manual entry (cash)
- [x] Bank transfer
- [ ] JazzCash / EasyPaisa (future)
- [ ] Stripe (if needed)
- [ ] Payment reconciliation

### Accounting
- [x] Income & expense ledger
- [ ] Export to Excel / PDF for finance (defaulters CSV done)
- [ ] Audit-ready reports

---

## 7. Complaints & Service Requests

### Complaint System
- [ ] Category-based complaints (current complaints flow does not yet implement a dedicated category taxonomy)
- [x] Priority levels
- [ ] SLA timers
- [x] Status tracking
- [x] Admin notes (progress)
- [ ] Resident feedback (after resolution)

### Maintenance Requests
- [x] Completion / payment proof (partial: resident payment-proof upload + admin approve/reject; admin receipt upload on maintenance record; complaint attachments separate)
- [ ] Resident approval

---

## 8. Communication & Announcements

### Announcements
- [x] Union-wide
- [x] Block-specific
- [x] Role-specific (partial: `audience` + filtering for resident/staff vs admin targeting)
- [ ] Scheduled publishing

### Notifications
- [ ] In-app notifications (stored feed; push + email exist; `/api/notifications` is push subscribe/VAPID only)
- [ ] SMS (Pakistan-ready)
- [x] Email
- [x] Push notifications (mobile)

---

## 9. Staff & Vendor Management
- [ ] Security guards (staff type)
- [ ] Maintenance staff (staff type; currently single staff role)
- [ ] Contractors
- [ ] Duty schedules
- [ ] Salary/payment tracking
- [ ] Performance notes

---

## 10. Mobile App Features (Residents)

### Must-Have
- [ ] Login via OTP
- [ ] Pay bills in app (view dues done)
- [x] Submit complaints
- [x] Track requests
- [ ] View announcements (full announcements experience still partial)
- [x] Push notifications

### Nice-to-Have
- [ ] Visitor entry requests
- [ ] Emergency alerts
- [ ] Community chat (moderated)
- [ ] Event calendar

---

## 13. Admin Web Dashboard

### Union Admin Dashboard
- [x] Financial overview
- [x] Pending complaints
- [x] Active residents
- [x] Recent payments

### Super Admin Dashboard
- [x] Total unions
- [x] Revenue stats
- [ ] Active users (dedicated card)
- [ ] System health
- [ ] Feature usage

---

## 14. Reporting & Analytics
- [x] Monthly financial reports
- [ ] Complaint resolution time
- [x] Payment defaulters
- [ ] Resident engagement
- [ ] Export (PDF, Excel) for all reports (defaulters CSV done)

---

## 15. System-Level Essentials
- [ ] Full audit logs (partial: `audit_log` for apartments/settings/escalations/users/finance; many other admin actions also recorded in `activity_timeline`; unify or expand `audit_log` coverage as needed)
- [ ] Soft deletes (partial: users, finance, complaints, maintenance, announcements, and units moved to soft-delete columns/queries)
- [ ] Activity timeline (partial: timeline table + super-admin `GET /activity-timeline` with filters: resource_type/id, action, action_prefix, user_id, role, society_id, date_from/to, paginated total; writes for users/finance/complaints/maintenance/announcements/properties; UI pending)
- [ ] Role permission editor (partial: role_permissions table + permission middleware + super-admin permission APIs + enforcement on users/finance/complaints/maintenance/properties/announcements mutations; UI pending)
- [ ] Feature toggles (beyond visibility toggles per society) (partial: global_feature_flags APIs added; UI + endpoint guards expansion pending)
- [x] Backup & restore (DB backup/restore scripts + npm commands added)
- [x] Error monitoring (Sentry) (backend integration via `SENTRY_DSN`)
- [ ] API versioning (partial: `/api/v1` alias exists for some routes; not full versioned contract)
- [ ] Localization (Urdu + English)
- [ ] Timezone handling (PKT) – beyond en-PK currency

### System Essentials Execution Plan

#### P1 (Stability & Safety)
- [x] Error monitoring baseline (backend Sentry init + error capture)
- [x] Backup/restore operational scripts
- [ ] Full audit log coverage for all admin mutation endpoints

#### P2 (Data Integrity & Traceability)
- [ ] Soft deletes expanded to more modules (complaints/maintenance/announcements/units done; blocks/floors and remaining domains pending)
- [ ] Activity timeline UI + richer coverage for non-finance/user domains (backend write coverage expanded to complaints/maintenance/announcements/properties)

#### P3 (Governance & Controlled Rollout)
- [ ] Permission editor UI + broader `requirePermission` enforcement (expanded to complaints/maintenance/properties/announcements in backend)
- [ ] Feature toggles expanded at runtime for guarded endpoints/features

### API mount quick reference (`backend/server.js`)

- **Base URL**: `/api/…` — same routers are also mounted under **`/api/v1/…`** (alias; no separate handlers).
- **Health / diagnostics**: `GET /health`, `GET /api/test/db`
- **Static uploads**: `/uploads` (profile images, etc.)
- **Route prefixes** (each file defines its own subpaths; see `backend/routes/*.js`):
  - `/api/bootstrap`
  - `/api/auth`
  - `/api/test`
  - `/api/societies`
  - `/api/residents`
  - `/api/maintenance`
  - `/api/finance`
  - `/api/complaints`
  - `/api/defaulters`
  - `/api/announcements`
  - `/api/properties`
  - `/api/users`
  - `/api/employees`
  - `/api/union-members`
  - `/api/super-admin` (audit, escalations, governance: permissions, feature flags, activity timeline)
  - `/api/settings` (e.g. `GET`/`PUT /api/settings/global` for super admin)
  - `/api/staff`
  - `/api/notifications`
  - `/api/messages`
  - `/api/cron`
  - `/api/unit-claims`
  - `/api/whatsapp` (Meta webhook + adapter)

---

## 16. Legal & Pakistan-Specific Considerations
- [ ] CNIC data protection
- [ ] PTA-compliant SMS gateway
- [ ] Data residency awareness
- [ ] Union bylaws compliance
- [ ] Manual override options (for real-world admin needs)

---

## 17. WhatsApp Action-Bot (Adapter Layer)
- [x] Meta Cloud webhook endpoint (`/api/whatsapp/webhook`)
- [x] Signature verification with optional `WA_APP_SECRET` (HMAC SHA-256)
- [x] Idempotency log for inbound events (`whatsapp_event_logs`)
- [x] Session state for menu-driven actions (`whatsapp_sessions`)
- [x] Resident identity mapping via normalized phone number (`users.contact_number`)
- [x] Action-menu flow (button driven, no chatbot free-text dependency)
- [x] Resident action: submit maintenance payment proof via WhatsApp
- [x] Reuse existing maintenance payment-request business logic (no duplicate domain logic)
- [x] Feature flag for staged rollout (`WHATSAPP_ENABLED`)
- [x] Webhook rate limiting (`whatsappWebhookRateLimiter`)

### Required Environment Variables
- `WHATSAPP_ENABLED=true`
- `WA_VERIFY_TOKEN=<random-string-used-in-meta-webhook-setup>`
- `WA_ACCESS_TOKEN=<meta-system-user-access-token>`
- `WA_PHONE_NUMBER_ID=<meta-whatsapp-phone-number-id>`
- `WA_APP_SECRET=<optional-but-recommended-for-signature-validation>`
- `WA_META_BASE_URL=https://graph.facebook.com/v21.0` (optional override)

### Release Notes (Current Scope)
- First release is intentionally limited to one resident action: payment-proof submission.
- Adapter layer orchestrates existing APIs/tables and does not introduce new finance or maintenance business rules.

---

*Tick [ ] → [x] as you complete each task. Out of scope per project: TypeScript on web, shared design system (web + mobile).*