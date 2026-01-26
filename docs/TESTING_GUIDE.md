# Testing Guide - Complete Setup

## Step 1: Hash User Password

First, hash the password for the user you created:

```bash
cd backend
npm run hash:password
```

This will hash the password `admin123` for `admin@homelandunion.com`.

**Or manually update in database:**
```sql
-- Connect to database
\c homeland_union

-- Hash password using bcrypt (you'll need to run the script or use a bcrypt generator)
-- For now, the login will accept both hashed and plain password
```

## Step 2: Test Backend Login API

### Using Browser (GET won't work - use POST)

Open browser console and run:
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@homelandunion.com',
    password: 'temp_password'  // or 'admin123' if you hashed it
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Using curl (Command Line)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@homelandunion.com\",\"password\":\"temp_password\"}"
```

### Using Postman
1. Method: POST
2. URL: `http://localhost:3000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "admin@homelandunion.com",
  "password": "temp_password"
}
```

## Step 3: Test Frontend Login

1. **Start frontend** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser**: `http://localhost:5173`

3. **Login with**:
   - Email: `admin@homelandunion.com`
   - Password: `temp_password` (or the password you set)

4. **You should be redirected** to the appropriate dashboard based on role.

## Step 4: Verify Everything Works

### Backend Tests:
- ✅ `http://localhost:3000/health` - Should return OK
- ✅ `http://localhost:3000/api/test/db` - Should show database connection
- ✅ `POST http://localhost:3000/api/auth/login` - Should return token

### Frontend Tests:
- ✅ Login page loads at `http://localhost:5173/login`
- ✅ Can login with credentials
- ✅ Redirects to correct dashboard
- ✅ Sidebar navigation works
- ✅ Logout works

## Troubleshooting

### "Route not found" on login
- Make sure you're using **POST** method, not GET
- Check backend server is running on port 3000
- Verify route is `/api/auth/login` (not `/auth/login`)

### Login fails
- Check password is correct
- Verify user exists in database
- Check backend console for errors
- Verify JWT_SECRET is set in backend `.env`

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is configured in backend
- Check browser console for errors

## Next Steps After Login Works

1. ✅ Test all API endpoints
2. ✅ Create more test users
3. ✅ Build out dashboard pages
4. ✅ Add data tables with MUI DataGrid
5. ✅ Implement forms with Formik
6. ✅ Add charts with ApexCharts
