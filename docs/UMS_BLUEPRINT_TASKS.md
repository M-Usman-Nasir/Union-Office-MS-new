# UMS Blueprint – Task Checklist

Use this list to track progress. **Checked [x] = already in your current system.** Unchecked [ ] = to do; tick when complete.

---

## 1. Core System Architecture

### Backend
- [x] Node.js + Express.js
- [x] PostgreSQL (primary database)
- [ ] Redis (sessions, OTPs, caching, queues)
- [x] REST API
- [x] JWT + Refresh Tokens
- [ ] RBAC with full permission matrix (currently role-based only)

### Frontend
- [x] Web: React
- [x] Mobile: React Native (resident app)
- [x] Shared API layer (same backend for web + mobile)

### Infrastructure
- [ ] Dockerized services
- [ ] NGINX (reverse proxy)
- [ ] Cloud deployment (AWS / DigitalOcean / Hetzner)
- [ ] CI/CD pipeline
- [ ] Automated backups

---

## 2. User Roles & Authority Model

### Super Admin (Platform Owner)
- [x] Create unions (apartments)
- [ ] Formal approve workflow for unions
- [x] Create Union Admin accounts
- [x] View system-wide analytics
- [x] Manage subscriptions & billing (basic)
- [ ] Control global settings (currently per society only)
- [ ] Enable/disable features per union
- [ ] System audit logs
- [ ] Resolve disputes & escalations

### Union Admin (Local Union Authority)
- [x] Manage residents
- [ ] Approve property ownership/tenancy
- [x] Manage staff (guards, maintenance)
- [x] Manage finances
- [x] Post announcements
- [x] Handle complaints
- [ ] Schedule meetings & elections
- [x] Generate official reports
- [x] Messaging with residents

### Resident (End User)
- [x] View bills
- [ ] Full pay-dues flow (currently payment recording only)
- [x] Submit complaints
- [ ] Vote in elections/polls
- [x] View announcements
- [ ] Book facilities
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
- [ ] RBAC with permission matrix (currently role-based only)
- [x] Union-scoped access
- [ ] Row-level security in PostgreSQL

### Security Measures
- [ ] Rate limiting
- [ ] IP blocking
- [ ] Encrypted sensitive fields (CNIC etc.; passwords already hashed)
- [ ] Audit trails for all admin actions
- [ ] GDPR-style data control

---

## 4. Union & Property Management

### Union Setup
- [x] Union profile (name, address, city, area)
- [x] Location: City
- [ ] Location: District, UC
- [ ] Union rules & bylaws
- [ ] Office bearers
- [ ] Election cycle

### Property Management
- [x] Units (houses/flats/shops – no type field yet)
- [x] Blocks / Streets / Sectors (blocks, floors)
- [ ] Ownership history
- [ ] Formal tenant vs owner flag (currently owner_name/resident_name only)
- [ ] Property status: active, vacant, disputed (currently is_occupied only)

---

## 5. Resident Management
- [x] Resident profiles (name, contact, unit, move-in, profile image)
- [ ] Family members
- [ ] CNIC (encrypted / masked)
- [ ] Ownership documents upload
- [ ] Tenant agreements
- [ ] Full move-in / move-out tracking (currently move_in_date only)
- [ ] Blacklist / violation history

---

## 6. Financial Management

### Dues & Billing
- [x] Monthly maintenance fees
- [ ] Special charges
- [ ] Penalties & late fees
- [ ] Auto-generated invoices
- [ ] PDF receipts

### Payments
- [x] Manual entry (cash)
- [x] Bank transfer
- [ ] JazzCash / EasyPaisa (future)
- [ ] Stripe (if needed)
- [ ] Payment reconciliation

### Accounting
- [x] Income & expense ledger
- [ ] Vendor payments (dedicated; currently expense entries only)
- [ ] Budget planning
- [ ] Export to Excel / PDF for finance (defaulters CSV done)
- [ ] Audit-ready reports

---

## 7. Complaints & Service Requests

### Complaint System
- [ ] Category-based complaints
- [x] Priority levels
- [ ] SLA timers
- [x] Status tracking
- [x] Admin notes (progress)
- [ ] Resident feedback (after resolution)

### Maintenance Requests
- [ ] Assign to vendors (currently staff only)
- [ ] Cost tracking
- [ ] Completion proof (images) – dedicated flow (currently complaint attachments only)
- [ ] Resident approval

---

## 8. Communication & Announcements

### Announcements
- [x] Union-wide
- [x] Block-specific
- [ ] Role-specific (currently audience field only)
- [ ] Scheduled publishing

### Notifications
- [ ] In-app notifications (stored feed)
- [ ] SMS (Pakistan-ready)
- [x] Email
- [x] Push notifications (mobile)

---

## 9. Elections, Voting & Polls
- [ ] Elections – candidate management
- [ ] Elections – voter eligibility
- [ ] Elections – secure voting
- [ ] Elections – time-bound
- [ ] Elections – result transparency
- [ ] Polls & surveys – community decisions
- [ ] Polls – simple voting
- [ ] Polls – analytics

---

## 10. Meetings & Documents
- [ ] Meeting scheduling
- [ ] Agenda management
- [ ] Attendance tracking
- [ ] Minutes of meeting (MoM)
- [ ] Official document repository
- [ ] Version control (documents)

---

## 11. Staff & Vendor Management
- [ ] Security guards (staff type)
- [ ] Maintenance staff (staff type; currently single staff role)
- [ ] Contractors
- [ ] Duty schedules
- [ ] Salary/payment tracking
- [ ] Performance notes

---

## 12. Mobile App Features (Residents)

### Must-Have
- [ ] Login via OTP
- [ ] Pay bills in app (view dues done)
- [x] Submit complaints
- [x] Track requests
- [ ] View announcements (full list; union info done)
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
- [ ] Upcoming meetings

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
- [ ] Full audit logs
- [ ] Soft deletes
- [ ] Activity timeline
- [ ] Role permission editor
- [ ] Feature toggles (beyond visibility toggles per society)
- [ ] Backup & restore
- [ ] Error monitoring (Sentry)
- [ ] API versioning (e.g. /api/v1/)
- [ ] Localization (Urdu + English)
- [ ] Timezone handling (PKT) – beyond en-PK currency

---

## 16. Legal & Pakistan-Specific Considerations
- [ ] CNIC data protection
- [ ] PTA-compliant SMS gateway
- [ ] Data residency awareness
- [ ] Union bylaws compliance
- [ ] Manual override options (for real-world admin needs)

---

*Tick [ ] → [x] as you complete each task. Out of scope per project: TypeScript on web, shared design system (web + mobile).*
