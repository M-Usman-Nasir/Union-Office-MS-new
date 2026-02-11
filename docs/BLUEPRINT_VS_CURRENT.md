# UMS Blueprint vs Current System – Checklist

This document compares the production-grade Union Management System (UMS) blueprint for Pakistan with the current codebase.  
**✅ = Already done** · **❌ = Necessary to align (not yet done)**

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
| RBAC (Role-Based Access Control) | ⚠️ Role-based only; no permission matrix yet |

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
| Automated backups | ❌ |

---

## 2. User Roles & Authority Model

### Super Admin (Platform Owner)

| Responsibility | Status |
|----------------|--------|
| Create / approve unions (apartments) | ✅ Create; ❌ formal approve workflow |
| Create Union Admin accounts | ✅ |
| View system-wide analytics | ✅ |
| Manage subscriptions & billing | ✅ (basic) |
| Control global settings | ⚠️ Settings per society only |
| Enable/disable features per union | ❌ |
| System audit logs | ❌ |
| Resolve disputes & escalations | ❌ |

### Union Admin (Local Union Authority)

| Responsibility | Status |
|----------------|--------|
| Manage residents | ✅ |
| Approve property ownership/tenancy | ❌ |
| Manage staff (guards, maintenance) | ✅ |
| Manage finances | ✅ |
| Post announcements | ✅ |
| Handle complaints | ✅ |
| Schedule meetings & elections | ❌ |
| Generate official reports | ✅ |
| Messaging with residents | ✅ (extra in current system) |

### Resident (End User)

| Responsibility | Status |
|----------------|--------|
| View bills & pay dues | ✅ View; ⚠️ “pay” = record payment, not full payment flow |
| Submit complaints | ✅ |
| Vote in elections/polls | ❌ |
| View announcements | ✅ |
| Book facilities | ❌ |
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
| RBAC (role + permission matrix) | ⚠️ Role-based only |
| Union-scoped access | ✅ |
| Row-level security in PostgreSQL | ❌ (enforced in app only) |

### Security Measures

| Item | Status |
|------|--------|
| Rate limiting | ❌ |
| IP blocking | ❌ |
| Encrypted sensitive fields | ⚠️ Passwords hashed; CNIC etc. not encrypted |
| Audit trails for all admin actions | ❌ |
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
| Election cycle | ❌ |

### Property Management

| Item | Status |
|------|--------|
| Houses / Flats / Shops (units) | ✅ (no type: house/flat/shop) |
| Blocks / Streets / Sectors | ✅ Blocks, floors |
| Ownership history | ❌ |
| Tenant vs Owner | ⚠️ owner_name / resident_name only; no formal flag |
| Property status (active, vacant, disputed) | ⚠️ is_occupied only; no “disputed” |

---

## 5. Resident Management

| Item | Status |
|------|--------|
| Resident profiles (name, contact, unit, move-in, profile image) | ✅ |
| Family members | ❌ |
| CNIC (encrypted / masked) | ❌ |
| Ownership documents upload | ❌ |
| Tenant agreements | ❌ |
| Move-in / move-out tracking | ⚠️ move_in_date only; no move-out or history |
| Blacklist / violation history | ❌ |

---

## 6. Financial Management

### Dues & Billing

| Item | Status |
|------|--------|
| Monthly maintenance fees | ✅ |
| Special charges | ❌ |
| Penalties & late fees | ❌ |
| Auto-generated invoices | ❌ |
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
| In-app notifications | ❌ |
| SMS (Pakistan-ready) | ❌ |
| Email | ✅ |
| Push notifications (mobile) | ✅ |

---

## 9. Elections, Voting & Polls

| Item | Status |
|------|--------|
| Elections – candidate management | ❌ |
| Elections – voter eligibility | ❌ |
| Elections – secure voting | ❌ |
| Elections – time-bound | ❌ |
| Elections – result transparency | ❌ |
| Polls & surveys – community decisions | ❌ |
| Polls – simple voting | ❌ |
| Polls – analytics | ❌ |

---

## 10. Meetings & Documents

| Item | Status |
|------|--------|
| Meeting scheduling | ❌ |
| Agenda management | ❌ |
| Attendance tracking | ❌ |
| Minutes of meeting (MoM) | ❌ |
| Official document repository | ❌ |
| Version control (documents) | ❌ |

---

## 11. Staff & Vendor Management

| Item | Status |
|------|--------|
| Security guards | ❌ |
| Maintenance staff | ⚠️ Staff role only; no types |
| Contractors | ❌ |
| Duty schedules | ❌ |
| Salary/payment tracking | ❌ |
| Performance notes | ❌ |

---

## 12. Mobile App Features (Residents)

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

## 13. Admin Web Dashboard

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

## 14. Reporting & Analytics

| Item | Status |
|------|--------|
| Monthly financial reports | ✅ |
| Complaint resolution time | ❌ |
| Payment defaulters | ✅ |
| Resident engagement | ❌ |
| Export (PDF, Excel) | ⚠️ Defaulters CSV ✅; Finance PDF/Excel ❌ |

---

## 15. System-Level Essentials

| Item | Status |
|------|--------|
| Full audit logs | ❌ |
| Soft deletes | ❌ |
| Activity timeline | ❌ |
| Role permission editor | ❌ |
| Feature toggles | ⚠️ Visibility toggles per society only |
| Backup & restore | ❌ |
| Error monitoring (Sentry) | ❌ |
| API versioning | ❌ |
| Localization (Urdu + English) | ❌ |
| Timezone handling (PKT) | ⚠️ en-PK currency only |

---

## 16. Legal & Pakistan-Specific Considerations

| Item | Status |
|------|--------|
| CNIC data protection | ❌ |
| PTA-compliant SMS gateway | ❌ |
| Data residency awareness | ❌ |
| Union bylaws compliance | ❌ |
| Manual override options | ❌ |

---

## 17. Summary

- **✅ Already done:** Backend (Node, Express, PostgreSQL, JWT+refresh, roles, union scope), three main roles + staff, core features (unions/apartments, properties, residents, maintenance, finance, complaints, defaulters, announcements, subscriptions, reports, messaging, notifications), React web + React Native resident app, shared API. Resident profiles & move-in; monthly dues & manual/bank payments; complaint priority, status, admin notes, staff assign; announcements union/block; email + push. Staff role & complaint/payment assign; mobile view dues, complaints, push, 1:1 chat; Union Admin dashboard (finance, complaints, residents, recent payments); Super Admin (unions, revenue); monthly finance reports, defaulters CSV; visibility toggles; en-PK currency.
- **❌ Necessary to align:** Redis, Docker, NGINX, cloud, CI/CD, backups; CNIC encryption/masking, OTP, 2FA; permission matrix/RLS; rate limiting, IP blocking, audit logs, GDPR-style; District/UC, bylaws, office bearers; ownership history, tenant/owner flag, property status; family members, ownership docs, tenant agreements, move-out, blacklist/violations; special charges, penalties, invoices, PDF receipts, JazzCash/Stripe, reconciliation, budget, audit reports; complaint category, SLA, resident feedback, maintenance cost/completion/approval; scheduled announcements, in-app notifications, SMS; elections & polls; meetings & document repository. Staff: guard/contractor types, duty schedules, salary/performance. Mobile: OTP login, in-app pay, visitor entry, emergency alerts, community chat, event calendar. Dashboards: upcoming meetings, active users card, system health, feature usage. Reporting: resolution time, engagement, PDF/Excel. System: audit logs, soft deletes, activity timeline, permission editor, feature toggles, backup/restore, Sentry, API versioning, Urdu+English, PKT. Legal: CNIC protection, PTA SMS, data residency, bylaws compliance, manual override.

---

*Last updated to match the UMS blueprint. TypeScript on web and shared design system (web + mobile) are out of scope per project choice.*
