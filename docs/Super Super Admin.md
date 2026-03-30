Name: Usman
Email: usmannasir98@gmail.com
hidden_from_ui: true
Initial password: ChangeMe!HumsHidden2026

databae users
row: 287
id: 338
"Usman"	
"usmannasir98@gmail.com"	
"$2a$10$J6CI7zXUK/Ff7d.tWd86lufAugyhf7OEnSggSG3dScYbijdM.VItq"	
"super_admin"							
true		
"2026-03-30 10:27:23.645653"	
"2026-03-30 10:27:23.645653"									
false			
true

Here are practical ways to get a new super admin after the DB is empty or has no admins, from most supported to most “manual.”

1. Bootstrap API (recommended)
This is what your repo documents in docs/BOOTSTRAP.md: set env vars on the backend (BOOTSTRAP_SECRET, BOOTSTRAP_SUPER_ADMIN_EMAIL, BOOTSTRAP_SUPER_ADMIN_PASSWORD, optional BOOTSTRAP_SUPER_ADMIN_NAME), then:
POST /api/bootstrap
Header: X-Bootstrap-Secret: <same as BOOTSTRAP_SECRET>

2. Truly manual: SQL INSERT into users
You must insert a bcrypt hash in password, not plain text (same as login).

Steps:

Generate a hash, e.g. run a small Node one-liner with bcryptjs, or adapt backend/scripts/hashPassword.js to print a hash for a new password (that script currently updates an existing user; you’d use the same bcrypt.hash(..., 10) output in an INSERT).
Connect to Postgres (Render Shell, psql, or any SQL client) against your DATABASE_URL.
INSERT into users with at least: email, password (hash), name, role = 'super_admin', is_active = true, plus any NOT NULL columns your current schema requires (check database/schema.sql / migrations for defaults).

For the hidden owner pattern (hidden_from_ui), migration 048 shows an example that also sets hidden_from_ui, must_change_password,
