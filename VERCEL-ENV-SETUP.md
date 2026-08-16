# Vercel Environment Variables Setup

## CRITICAL: Add These Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables

### **1. Database Connection Variables** (MOST IMPORTANT)

```
Name: POSTGRES_PRISMA_URL
Value: postgresql://neondb_owner:npg_cSkor8ZKzpg5@ep-super-grass-awbww89y-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&connect_timeout=15&sslmode=require
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: POSTGRES_URL
Value: postgresql://neondb_owner:npg_cSkor8ZKzpg5@ep-super-grass-awbww89y-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_cSkor8ZKzpg5@ep-super-grass-awbww89y-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
Environments: ✓ Production  ✓ Preview  ✓ Development
```

### **2. Session & Auth Variables**

```
Name: SESSION_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: NEXTAUTH_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production  ✓ Preview  ✓ Development
```

### **3. App Configuration**

```
Name: SKIP_ENV_VALIDATION
Value: true
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: NODE_ENV
Value: production
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: NEXT_PUBLIC_BASE_URL
Value: https://mbita-emmanuel.vercel.app
Environments: ✓ Production  ✓ Preview  ✓ Development
```

---

## How to Add Variables to Vercel:

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click on your project: **mbita-emmanuel**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable above:
   - Enter the **Name**
   - Enter the **Value**
   - Check all three environments: **Production**, **Preview**, **Development**
   - Click **Save**

### Option 2: Via Vercel CLI
```bash
vercel env add POSTGRES_PRISMA_URL production
# Paste the value when prompted
# Repeat for all variables
```

---

## After Adding Environment Variables:

### Step 1: Redeploy WITHOUT Cache
```bash
# Go to Deployments tab in Vercel Dashboard
# Click the three dots (...) on latest deployment
# Click "Redeploy"
# IMPORTANT: Check "Use existing Build Cache" → OFF
# Click "Redeploy"
```

### Step 2: Or Push a New Commit
```bash
git commit --allow-empty -m "Trigger deployment after env vars setup"
git push origin main
```

---

## Verification:

Once deployed, test the admin login:
- URL: https://mbita-emmanuel.vercel.app/admin
- Username: `Mbita`
- Password: `mbita@12345`

---

## Why This Happened:

Your code in `lib/prisma.ts` tries to read environment variables in this order:
1. `POSTGRES_PRISMA_URL` (priority)
2. `POSTGRES_URL` (fallback)
3. `DATABASE_URL` (final fallback)

When none of these exist in Vercel, Prisma defaults to `localhost:5432`, which doesn't exist on Vercel's servers.

---

## Admin Credentials (Save These!):

- **Username:** Mbita
- **Password:** mbita@12345
- **Database:** neondb (Vercel-managed Postgres on Neon)
- **Region:** US East 1 (Virginia)

---

## Need Help?

If you still see the error after adding variables and redeploying:
1. Check Vercel build logs for any errors
2. Verify all environment variables are saved correctly
3. Make sure you redeployed WITHOUT cache

