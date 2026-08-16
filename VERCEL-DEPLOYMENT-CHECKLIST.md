# ✅ Vercel Deployment Checklist

## 🎯 Current Status

- ✅ New database created (neondb on Neon)
- ✅ Database connected to Vercel
- ✅ Database environment variables auto-created
- ✅ Local setup complete (migrations + seed)
- ✅ Duplicate professor-website-v2 folder removed
- ✅ Code pushed to GitHub (will trigger deployment)

---

## ⚠️ REQUIRED: Add These Environment Variables to Vercel

Go to: https://vercel.com/dashboard → **mbita-emmanuel** → **Settings** → **Environment Variables**

### **Add These 4 Variables Manually:**

#### 1. SESSION_SECRET
```
Name: SESSION_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 2. NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 3. SKIP_ENV_VALIDATION
```
Name: SKIP_ENV_VALIDATION
Value: true
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 4. NEXT_PUBLIC_BASE_URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://mbita-emmanuel.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

---

## 📋 Auto-Created Database Variables (Already Done)

These were created when you connected the database:
- ✅ POSTGRES_URL
- ✅ POSTGRES_PRISMA_URL
- ✅ POSTGRES_URL_NON_POOLING
- ✅ POSTGRES_USER
- ✅ POSTGRES_HOST
- ✅ POSTGRES_PASSWORD
- ✅ POSTGRES_DATABASE

---

## 🚀 Deployment will happen automatically

The latest push will trigger Vercel deployment. Monitor it at:
https://vercel.com/dashboard → **mbita-emmanuel** → **Deployments**

---

## 🧪 After Deployment Completes

Test the admin login:
1. Visit: https://mbita-emmanuel.vercel.app/admin
2. Login with:
   - **Username:** Mbita
   - **Password:** mbita@12345

---

## ❓ If Build Still Fails

### Check 1: Verify all environment variables exist
Go to Settings → Environment Variables and ensure all 11 variables are there:
- POSTGRES_URL
- POSTGRES_PRISMA_URL
- POSTGRES_URL_NON_POOLING
- POSTGRES_USER
- POSTGRES_HOST
- POSTGRES_PASSWORD
- POSTGRES_DATABASE
- SESSION_SECRET
- NEXTAUTH_SECRET
- SKIP_ENV_VALIDATION
- NEXT_PUBLIC_BASE_URL

### Check 2: Redeploy without cache
1. Go to Deployments tab
2. Click three dots (...) on latest deployment
3. Click "Redeploy"
4. UNCHECK "Use existing Build Cache"
5. Click "Redeploy"

### Check 3: Check build logs
Look for any remaining errors in the deployment logs.

---

## 🔐 Admin Credentials

- **Username:** Mbita
- **Password:** mbita@12345
- **Local URL:** http://localhost:3000/admin
- **Production URL:** https://mbita-emmanuel.vercel.app/admin

---

## ✅ What Was Fixed

1. ❌ **Problem:** Build failing with "Module not found: @/components/ui/Button"
2. ✅ **Solution:** Removed duplicate `professor-website-v2` folder
3. ✅ **Result:** Clean build should now work

---

**Last Updated:** August 16, 2026  
**Database:** neondb (ep-still-wildflower-auh43w85)  
**Region:** US East 1 (c-10)

