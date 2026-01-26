# Quick Start Guide

## Step 1: Seed Database with Mock Data

Run the seed script to populate your database with test data:

```bash
cd backend
npm run seed
```

This will create:
- ✅ Test users (Super Admin, Union Admin, Resident)
- ✅ Society, Blocks, Floors, Units
- ✅ Maintenance records
- ✅ Finance records
- ✅ Complaints
- ✅ Announcements
- ✅ Defaulters

## Step 2: Test User Credentials

After seeding, you can login with:

### Super Admin
- **Email:** `admin@homelandunion.com`
- **Password:** `admin123`
- **Dashboard:** `/super-admin/dashboard`
- **Features:** View all societies, blocks, floors, units

### Union Admin
- **Email:** `unionadmin@homelandunion.com`
- **Password:** `admin123`
- **Dashboard:** `/admin/dashboard`
- **Features:** Manage residents, maintenance, finance, complaints, announcements, defaulters

### Resident
- **Email:** `resident@homelandunion.com`
- **Password:** `resident123`
- **Dashboard:** `/resident/dashboard`
- **Features:** View personal complaints, maintenance, announcements, defaulter status

## Step 3: Access Dashboards

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Login and Navigate:**
   - Go to `http://localhost:5173`
   - Login with any of the test credentials above
   - You'll be redirected to the appropriate dashboard based on your role

## Dashboard Features

### Super Admin Dashboard
- View total societies, blocks, and units
- See societies overview with details

### Admin Dashboard
- **Statistics Cards:**
  - Total Residents
  - Total Income
  - Defaulters Count
  - Amount Due
- **Recent Data Tables:**
  - Recent Complaints
  - Recent Maintenance
  - Recent Announcements

### Resident Dashboard
- **Status Cards:**
  - My Complaints count
  - Pending Maintenance
  - Defaulter Status
- **Data Tables:**
  - My Complaints
  - My Maintenance
  - Recent Announcements

## Next Steps

1. ✅ Test all three dashboards
2. ✅ Explore the navigation menu
3. ✅ Check data is loading correctly
4. ✅ Test logout functionality
5. ✅ Build out individual module pages (Residents, Maintenance, etc.)

## Troubleshooting

### No data showing?
- Make sure you ran `npm run seed` in the backend folder
- Check backend server is running
- Check browser console for errors
- Verify database connection

### Can't login?
- Make sure backend is running on port 3000
- Check `.env` file has correct database credentials
- Verify user exists in database

### API errors?
- Check backend console for error messages
- Verify all migrations ran (`npm run migrate:lastlogin`)
- Check CORS settings in backend
