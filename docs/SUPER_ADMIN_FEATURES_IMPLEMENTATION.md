# Super Admin Features – Implementation Plan

## 1. Formal approve workflow for unions

- **DB**: Add `approval_status` to `apartments`: `pending` | `approved` | `rejected`. Default `pending` for new; existing rows backfilled to `approved`.
- **API**: 
  - `PATCH /api/societies/:id/approve` (super_admin) – set status to approved, optional notes.
  - `PATCH /api/societies/:id/reject` (super_admin) – set status to rejected, optional notes.
  - `GET /api/societies` – support filter `approval_status`; list returns `approval_status`.
  - Union admin login: require apartment `approval_status = 'approved'` (in addition to active subscription).
- **UI**: 
  - Apartments list: column/tag for Approval status; filter by Pending/Approved/Rejected.
  - Row actions: Approve / Reject with optional notes (for pending).
  - Create apartment: new records created as `pending`.

## 2. Global settings

- **DB**: Table `global_settings` (id, key UNIQUE, value JSONB/text, updated_at). Keys e.g. `default_currency`, `default_due_day`, `maintenance_reminder_days_default`, `max_upload_size_mb`.
- **API**: 
  - `GET /api/settings/global` (super_admin) – return all key-value.
  - `PUT /api/settings/global` (super_admin) – body: object of keys to set.
- **UI**: Super Admin Settings page – new section "Global settings" (payment defaults, system rules). Save calls PUT.

## 3. Enable/disable features per union

- **DB**: Table `union_features` (society_apartment_id, feature_key, enabled boolean). PK (society_apartment_id, feature_key). Features: e.g. `complaints`, `maintenance`, `announcements`, `finance_reports`, `defaulters_visible`, `messaging`.
- **API**: 
  - `GET /api/societies/:id/features` (super_admin) – return feature flags for union.
  - `PUT /api/societies/:id/features` (super_admin) – body: { features: { [key]: boolean } }.
  - Where relevant (complaints, maintenance, etc.): if union has feature disabled, return 403 or filter data (e.g. middleware or per-route check using society_apartment_id from user).
- **UI**: Super Admin – Apartment edit or separate "Union features" in row menu; toggles per feature. Resident/Union admin: menus can hide disabled features (from settings or a "features" endpoint per society).

## 4. System audit logs

- **DB**: Table `audit_log` (id, created_at, user_id, role, action, resource_type, resource_id, society_apartment_id, details JSONB, ip, user_agent).
- **API**: 
  - Audit service: `log(req, { action, resourceType, resourceId, societyId, details })` – called from controllers after mutations.
  - `GET /api/super-admin/audit-logs` (super_admin) – paginated list with filters (date, user, resource_type, action).
- **UI**: Super Admin – new "Audit logs" page; table with filters and export.

## 5. Resolve disputes & escalations

- **DB**: Add to `complaints`: `escalated_at`, `escalated_by` (user_id), `escalation_reason`, `resolved_by_super_at`, `resolved_by_super_id`, `resolution_notes`.
- **API**: 
  - `POST /api/complaints/:id/escalate` (union_admin or resident) – set escalated_at, escalated_by, reason; only if not already escalated.
  - `GET /api/super-admin/escalations` (super_admin) – list complaints where escalated_at IS NOT NULL, with filters.
  - `PATCH /api/super-admin/escalations/:id/resolve` (super_admin) – set resolved_by_super_at, resolved_by_super_id, resolution_notes.
- **UI**: 
  - Super Admin – "Escalations" page; list escalated complaints; resolve dialog with notes.
  - Admin/Resident complaint detail – "Escalate to platform" button when not escalated.

---

## Implementation order

1. Migrations (033–037) for all schema changes.
2. Backend: audit service + middleware usage; global settings; apartment approval + features; escalation endpoints; apartment controller and auth updates.
3. Frontend: constants/routes/API; Apartments (approval + features); Settings (global); Audit logs page; Escalations page; Complaints (escalate button).
