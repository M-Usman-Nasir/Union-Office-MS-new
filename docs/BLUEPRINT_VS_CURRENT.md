# UMS Blueprint vs Current System – Checklist

This document compares the production-grade Union Management System (UMS) blueprint for Pakistan with the current codebase.  
**✅ = Already done** · **⚠️ = Partial / optional / not everywhere** · **❌ = Necessary to align (not yet done)**  
*Last reviewed against the repo: March 2026.*

---

## 1. Core System Architecture

### Backend

| Item | Status |
|------|--------|
| Node.js + Express.js | ✅ |
| PostgreSQL (primary database) | ✅ |
| Redis (sessions, OTPs, caching, queues) | ❌ |
| REST API | ✅ |
| JWT + Refresh Tokens | ✅ |
| RBAC (Role-Based Access Control) | ⚠️ Roles + optional `role_permissions` matrix (`requirePermission` when rows exist) |

### Frontend

| Item | Status |
|------|--------|
| Web: React | ✅ |
| Mobile: React Native (resident app) | ✅ |
| Shared API layer (same backend for web + mobile) | ✅ |

### Infrastructure

| Item | Status |
|------|--------|
| Dockerized services | ❌ |
| NGINX (reverse proxy) | ❌ |
| Cloud deployment (AWS / DigitalOcean / Hetzner) | ❌ |
| CI/CD pipeline | ❌ |
| Automated backups | ⚠️ `backup:db` / `restore:db` scripts; no scheduled cloud backups |

---

## 2. User Roles & Authority Model

### Super Admin (Platform Owner)

| Responsibility | Status |
|----------------|--------|
| Create / approve unions (apartments) | ✅ Create; ❌ formal approve workflow |
| Create Union Admin accounts | ✅ |
| View system-wide analytics | ✅ |
| Manage subscriptions & billing | ✅ (basic) |
| Control global settings | ⚠️ Global settings API + per-society settings |
| Enable/disable features per union | ⚠️ Per-society visibility toggles; global feature flags (`global_feature_flags`) |
| System audit logs | ⚠️ `audit_log` table, Super Admin list API; not every action logged |
| Resolve disputes & escalations | ⚠️ Escalated complaints workflow for Super Admin (`/escalations`) |

### Union Admin (Local Union Authority)

| Responsibility | Status |
|----------------|--------|
| Manage residents | ✅ |
| Approve property ownership/tenancy | ✅ (resident requests unit link → admin approves/rejects) |
| Manage staff (guards, maintenance) | ✅ |
| Manage finances | ✅ |
| Post announcements | ✅ |
| Handle complaints | ✅ |
| Generate official reports | ✅ |
| Messaging with residents | ✅ (extra in current system) |

### Resident (End User)

| Responsibility | Status |
|----------------|--------|
| View bills & pay dues | ✅ View; ⚠️ “pay” = record payment, not full payment flow |
| Submit complaints | ✅ |
| View announcements | ✅ |
| Track service requests (complaints) | ✅ |
| Receive notifications | ✅ |

---

## 3. Authentication & Security

### Authentication

| Item | Status |
|------|--------|
| CNIC-based identity (masked storage) | ❌ CNIC stored plain; no masking |
| Mobile number verification (OTP) | ❌ |
| Email login | ✅ |
| Password + OTP (2FA optional) | ❌ |
| Device-based login (mobile app) | ✅ |

### Authorization

| Item | Status |
|------|--------|
| RBAC (role + permission matrix) | ⚠️ Matrix in DB + middleware; routes opt in via `requirePermission` |
| Union-scoped access | ✅ |
| Row-level security in PostgreSQL | ❌ (enforced in app only) |

### Security Measures

| Item | Status |
|------|--------|
| Rate limiting | ⚠️ auth + WhatsApp webhook (`express-rate-limit`); not global on all routes |
| IP blocking | ❌ |
| Encrypted sensitive fields | ⚠️ Passwords hashed; CNIC etc. not encrypted |
| Audit trails for all admin actions | ⚠️ `audit_log` + writes from key controllers; not exhaustive |
| GDPR-style data control | ❌ |

---

## 4. Union & Property Management

### Union Setup

| Item | Status |
|------|--------|
| Union profile (name, address, city, area) | ✅ |
| Location: City | ✅ |
| Location: District, UC | ❌ |
| Union rules & bylaws | ❌ |
| Office bearers | ❌ |

### Property Management

| Item | Status |
|------|--------|
| Houses / Flats / Shops (units) | ✅ (no type: house/flat/shop) |
| Blocks / Streets / Sectors | ✅ Blocks, floors |
| Tenant vs Owner | ⚠️ owner_name / resident_name only; no formal flag |
| Property status (active, vacant, disputed) | ⚠️ is_occupied only; no “disputed” |

---

## 5. Resident Management

| Item | Status |
|------|--------|
| Resident profiles (name, contact, unit, move-in, profile image) | ✅ |
| Family members | ✅ (API: CRUD under resident `family-members`) |
| CNIC (encrypted / masked) | ❌ |
| Move-in / move-out tracking | ⚠️ move_in_date only; no move-out or history |
| Blacklist / violation history | ❌ |

---

## 6. Financial Management

### Dues & Billing

| Item | Status |
|------|--------|
| Monthly maintenance fees | ✅ |
| Penalties & late fees | ❌ |
| Auto-generated invoices | ⚠️ Monthly dues cron; subscription billing auto-invoice for union admins; not full resident PDF invoice product |
| PDF receipts | ❌ |

### Payments

| Item | Status |
|------|--------|
| Manual entry (cash) | ✅ |
| Bank transfer | ✅ |
| JazzCash / EasyPaisa (future) | ❌ |
| Stripe (if needed) | ❌ |
| Payment reconciliation | ❌ |

### Accounting

| Item | Status |
|------|--------|
| Income & expense ledger | ✅ |
| Vendor payments | ⚠️ as expense entries only |
| Budget planning | ❌ |
| Export to Excel / PDF | ⚠️ Defaulters CSV ✅; Finance PDF stub only |
| Audit-ready reports | ❌ |

---

## 7. Complaints & Service Requests

### Complaint System

| Item | Status |
|------|--------|
| Category-based complaints | ❌ |
| Priority levels | ✅ |
| SLA timers | ❌ |
| Status tracking | ✅ |
| Admin notes (progress) | ✅ |
| Resident feedback (after resolution) | ❌ |

### Maintenance Requests

| Item | Status |
|------|--------|
| Assign to staff/vendors | ⚠️ staff only; no vendors |
| Cost tracking | ❌ |
| Completion proof (images) | ⚠️ complaint attachments only |
| Resident approval | ❌ |

---

## 8. Communication & Announcements

### Announcements

| Item | Status |
|------|--------|
| Union-wide | ✅ |
| Block-specific | ✅ |
| Role-specific | ⚠️ audience field only |
| Scheduled publishing | ❌ |

### Notifications

| Item | Status |
|------|--------|
| In-app notifications | ⚠️ No dedicated inbox; mobile “Notifications” uses announcements feed; push + email elsewhere |
| SMS (Pakistan-ready) | ❌ |
| Email | ✅ |
| Push notifications (mobile) | ✅ |

---

## 9. Meetings & Documents

| Item | Status |
|------|--------|
| Meeting scheduling | ❌ |
| Agenda management | ❌ |
| Attendance tracking | ❌ |
| Minutes of meeting (MoM) | ❌ |
| Official document repository | ❌ |
| Version control (documents) | ❌ |

---

## 10. Staff & Vendor Management

| Item | Status |
|------|--------|
| Security guards | ⚠️ Generic staff role; no guard-specific type |
| Maintenance staff | ⚠️ Staff role only; no types |
| Contractors | ❌ |
| Duty schedules | ❌ |
| Salary/payment tracking | ❌ |
| Performance notes | ❌ |

---

## 11. Mobile App Features (Residents)

### Must-Have

| Item | Status |
|------|--------|
| Login via OTP | ❌ |
| View dues & pay bills | ⚠️ View ✅; pay in app ❌ |
| Submit complaints | ✅ |
| Track requests | ✅ |
| View announcements | ⚠️ Union info ✅; announcements list partial |
| Push notifications | ✅ |

### Nice-to-Have

| Item | Status |
|------|--------|
| Visitor entry requests | ❌ |
| Emergency alerts | ❌ |
| Community chat (moderated) | ❌ |
| Event calendar | ❌ |

---

## 12. Admin Web Dashboard

### Union Admin Dashboard

| Item | Status |
|------|--------|
| Financial overview | ✅ |
| Pending complaints | ✅ |
| Active residents | ✅ |
| Recent payments | ✅ |
| Upcoming meetings | ❌ |

### Super Admin Dashboard

| Item | Status |
|------|--------|
| Total unions | ✅ |
| Revenue stats | ✅ |
| Active users | ⚠️ No dedicated card |
| System health | ❌ |
| Feature usage | ❌ |

---

## 13. Reporting & Analytics

| Item | Status |
|------|--------|
| Monthly financial reports | ✅ |
| Complaint resolution time | ❌ |
| Payment defaulters | ✅ |
| Resident engagement | ❌ |
| Export (PDF, Excel) | ⚠️ Defaulters CSV ✅; Finance PDF/Excel ❌ |

---

## 14. System-Level Essentials

| Item | Status |
|------|--------|
| Full audit logs | ⚠️ `audit_log` + Super Admin queries; coverage not universal |
| Soft deletes | ⚠️ e.g. `deleted_at` on complaints, users; not all entities |
| Activity timeline | ⚠️ `activity_timeline` + Super Admin `GET /activity-timeline` (coverage varies) |
| Role permission editor | ⚠️ Super Admin API `GET/PUT /permissions/:role` |
| Feature toggles | ⚠️ Per-society visibility + global `global_feature_flags` |
| Backup & restore | ⚠️ `npm run backup:db` / `restore:db` (manual ops) |
| Error monitoring (Sentry) | ⚠️ `@sentry/node` when `SENTRY_DSN` is set |
| API versioning | ⚠️ e.g. `/api/v1/notifications` alongside `/api`; not full v1 everywhere |
| Localization (Urdu + English) | ❌ |
| Timezone handling (PKT) | ⚠️ en-PK currency only |

---

## 15. Legal & Pakistan-Specific Considerations

| Item | Status |
|------|--------|
| CNIC data protection | ❌ |
| PTA-compliant SMS gateway | ❌ |
| Data residency awareness | ❌ |
| Union bylaws compliance | ❌ |
| Manual override options | ❌ |

---

## 16. Summary

- **✅ Already done:** Backend (Node, Express, PostgreSQL, JWT+refresh, roles, union scope), three main roles + staff, core features (unions/apartments, properties, residents, **family members API**, maintenance, finance, complaints, defaulters, announcements, subscriptions, reports, messaging, notifications), React web + React Native resident app, shared API. Resident profiles & move-in; **automated monthly dues** & manual/bank payments; complaint priority, status, admin notes, staff assign; announcements union/block; email + push. Staff role & complaint/payment assign; mobile view dues, complaints, push, 1:1 chat; Union Admin dashboard (finance, complaints, residents, recent payments); Super Admin (unions, revenue, **escalations**, audit log listing, **role permissions & global feature flags APIs**); monthly finance reports, defaulters CSV; visibility toggles; en-PK currency.
- **⚠️ Partially in place:** Optional **permission matrix** (`role_permissions`), **rate limiting** on sensitive routes, **audit_log** + **activity_timeline** (not universal coverage), **Sentry** when configured, **soft deletes** on some tables, **backup/restore scripts**, **subscription auto-invoicing** for union admins, global + society settings, **in-app “notifications”** as announcements on mobile.
- **❌ Necessary to align:** Redis, Docker, NGINX, cloud, **automated** CI/CD & cloud backups; CNIC encryption/masking, OTP, 2FA; RLS in PostgreSQL; **global** rate limits & IP blocking; exhaustive audit/GDPR-style controls; District/UC, bylaws, office bearers; ownership history, tenant/owner flag, property status; ownership docs, tenant agreements, move-out, blacklist/violations; special charges, penalties, **formal PDF receipts/invoices for residents**, JazzCash/Stripe, reconciliation, budget, audit-ready reports; complaint category, SLA, resident feedback, maintenance cost/completion/approval; scheduled announcements, **true** in-app notification center, SMS; elections & polls; meetings & document repository. Staff: distinct guard/contractor types, duty schedules, salary/performance. Mobile: OTP login, in-app pay, visitor entry, emergency alerts, community chat, event calendar. Dashboards: upcoming meetings, active users card, system health, feature usage. Reporting: resolution time, engagement, fuller PDF/Excel. System: fuller audit coverage, soft deletes everywhere, Urdu+English, PKT. Legal: CNIC protection, PTA SMS, data residency, bylaws compliance, manual override.

---

*Aligned with the UMS blueprint and the current repo (React + Vite web, React Native resident app). TypeScript on web and a shared design system (web + mobile) remain out of scope per project choice.*