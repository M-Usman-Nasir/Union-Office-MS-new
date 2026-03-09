# Render – Frontend (Static Site) environment

So login and API calls work on the live site, the **frontend** must call the **backend** with the correct base URL.

## Set on Render → Frontend service → Environment

| Key | Value |
|-----|--------|
| **VITE_API_URL** | `https://backend-x9tr.onrender.com/api` |

Important:
- Use your real backend URL; it must end with **`/api`** (so login goes to `.../api/auth/login`).
- No trailing slash after `api`.

## After changing

1. Save the environment variable.
2. Trigger a **new deploy** of the frontend (or push a commit).  
   `VITE_*` values are baked in at **build time**, so the site must be rebuilt to use the new URL.

## Check

After redeploy, open the live login page, submit, and in DevTools → Network find the login request. Its URL should be:

`https://backend-x9tr.onrender.com/api/auth/login`

If it was `https://backend-x9tr.onrender.com/auth/login` (no `api`), the backend returns 404 "Route not found".

## SPA rewrite (fix "Not found" on refresh / deep links)

For a single-page app, the static host must serve `index.html` for every path (e.g. `/admin/dashboard`, `/login`) so the client router can handle the route. Otherwise refreshing or opening a deep link shows "Not found".

- **If your host reads `_redirects`:** The repo includes `public/_redirects` with `/* /index.html 200`. It is copied into the build output; ensure your Render static site uses it.
- **Otherwise in Render Dashboard:** Go to your **Static Site** → **Redirects/Rewrites** and add:
  - **Source:** `/*`
  - **Destination:** `/index.html`
  - **Action:** Rewrite (200)

## Keep backend awake (free tier)

On the free tier, the Node backend (and PostgreSQL) spin down after ~15 minutes of no traffic. The next request can time out or fail (e.g. refresh token fails → "Session expired" toast).

Use an external ping so the backend stays warm:

- **UptimeRobot** or **Cron-job.org** (free)
- Interval: every **10 minutes**
- URL: `https://your-backend.onrender.com/health`  
  Example: `https://backend-x9tr.onrender.com/health`

No code changes needed; configure this once. The app also uses a longer access token (1h) and only logs out when refresh returns 401, so cold starts are less likely to cause logout.
