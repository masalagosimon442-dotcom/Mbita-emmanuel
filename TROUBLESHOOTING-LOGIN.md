# 🔧 Troubleshooting Admin Login

## Problem: "Internal server error" on Admin Login

### ✅ Solutions:

---

## Solution 1: Check Database Connection

**After deployment, visit:**
```
https://your-site.vercel.app/api/health
```

This will show:
- ✅ **Connected:** Database is working
- ❌ **Error:** Shows specific database issue

---

## Solution 2: Verify Environment Variables in Vercel

1. Go to: **https://vercel.com/dashboard**
2. Click your project: **mbita-emmanuel**
3. Go to: **Settings** → **Environment Variables**
4. **Verify these exist:**

```
DATABASE_URL = postgresql://neondb_owner:npg_BMXlO3CKg6vw@ep-delicate-queen-ayjuc6e1-pooler.c-5.us-east-2.aws.neon.tech/Machiya?sslmode=require

SESSION_SECRET = 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
```

5. If missing or wrong, **add/update** them
6. Click **"Redeploy"** after changing

---

## Solution 3: Clear Browser Cache

The error might be from a previous failed attempt:

1. **Hard refresh** the login page:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. Or **clear browser cache** for the site

3. Try logging in again

---

## Solution 4: Check Vercel Deployment Logs

1. Go to: **https://vercel.com/dashboard**
2. Click your project
3. Click **"Deployments"**
4. Click the latest deployment
5. Click **"Functions"** tab
6. Look for errors related to `/api/auth/login`

Common errors:
- `P1001`: Cannot reach database
- `P1000`: Authentication failed
- `P1003`: Database does not exist

---

## Solution 5: Wake Up Neon Database

Neon databases on free tier may sleep after inactivity:

1. Visit health check: `https://your-site.vercel.app/api/health`
2. Wait 5-10 seconds for database to wake up
3. Try login again

---

## Solution 6: Manually Create Admin

If auto-creation fails, run this locally:

```bash
node setup-admin.js
```

This creates admin in database:
- Username: `Mbita`
- Password: `mbita@!12345`

---

## ✅ Testing Steps:

### Step 1: Health Check
Visit: `https://your-site.vercel.app/api/health`

**Expected response:**
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "name": "Machiya",
    "user": "neondb_owner"
  }
}
```

### Step 2: Try Login
1. Go to: `https://your-site.vercel.app/login`
2. Enter:
   - Username: `Mbita`
   - Password: `mbita@!12345`
3. Click **"Sign In"**

### Step 3: Check Error Message
If it still fails, the error message should now be more specific:
- "Cannot reach database server" → Database URL wrong
- "Authentication failed with database" → Password wrong
- "Database does not exist" → Database name wrong

---

## 🆘 If Still Not Working:

### Check Neon Dashboard:
1. Go to: **https://console.neon.tech/**
2. Select project: **dry-mode-01901677**
3. Check if database **"Machiya"** exists
4. Check if **Compute** is **Active** (not suspended)

### Copy Fresh Connection String:
1. In Neon dashboard, click **"Connection Details"**
2. Select **"Pooled connection"**
3. Copy the full connection string
4. Update in Vercel environment variables
5. Remove `&channel_binding=require` if present
6. Redeploy

---

## 📝 Current Credentials:

**Username:** `Mbita`  
**Password:** `mbita@!12345`  
**Email:** `mbita@university.edu`

---

## 🎯 Quick Fix Commands:

### Force Redeploy in Vercel:
```
Settings → Redeploy → Latest Deployment
```

### Test Database Locally:
```bash
node test-machiya-db.js
```

### Create Admin Locally:
```bash
node setup-admin.js
```

---

**After Vercel redeploys (1-2 minutes), try logging in again!** 🚀
