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
