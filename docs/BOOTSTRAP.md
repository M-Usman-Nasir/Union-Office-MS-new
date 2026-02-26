# Production bootstrap (no DB / no super_admin)

When the app is deployed (e.g. Render + Vercel) with a **new empty database**, there are no tables and no users. Use the **bootstrap** endpoint once to create the schema and the first super_admin.

## 1. Set environment variables on Render

In your **backend** service on Render → **Environment** → add:

| Variable | Value |
|----------|--------|
| `BOOTSTRAP_SECRET` | A random string you choose (e.g. `my-secret-abc123`) |
| `BOOTSTRAP_SUPER_ADMIN_EMAIL` | Email for the first super_admin (e.g. `admin@example.com`) |
| `BOOTSTRAP_SUPER_ADMIN_PASSWORD` | Password for that user |
| `BOOTSTRAP_SUPER_ADMIN_NAME` | (Optional) Display name, default: "Super Admin" |

Ensure your database is connected (e.g. `DATABASE_URL` from Render PostgreSQL, or `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`).

Redeploy the backend so these env vars are applied.

## 2. Call the bootstrap endpoint once

From your machine (or any HTTP client):

```bash
curl -X POST "https://homeland-union-office-management-system.onrender.com/api/bootstrap" \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Secret: YOUR_BOOTSTRAP_SECRET"
```

Replace `YOUR_BOOTSTRAP_SECRET` with the same value you set for `BOOTSTRAP_SECRET`.

On success you’ll get something like:

```json
{
  "success": true,
  "message": "Bootstrap completed.",
  "schemaRun": true,
  "migrations": { "applied": [...], "skipped": [...] },
  "superAdminCreated": true,
  "hint": "Log in with admin@example.com and the password you set. ..."
}
```

## 3. Log in

Open your frontend (e.g. https://homelandunionofficemanagementsystem.vercel.app/login) and log in with:

- **Email:** the value of `BOOTSTRAP_SUPER_ADMIN_EMAIL`
- **Password:** the value of `BOOTSTRAP_SUPER_ADMIN_PASSWORD`

## 4. (Optional) Remove bootstrap env vars

After the first successful login you can remove `BOOTSTRAP_SECRET`, `BOOTSTRAP_SUPER_ADMIN_EMAIL`, and `BOOTSTRAP_SUPER_ADMIN_PASSWORD` from Render so the bootstrap endpoint no longer works. If you leave them set, the endpoint will still run migrations and skip creating a user if a super_admin already exists.
