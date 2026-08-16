# Setup New Database - Step by Step

## 🗑️ DELETE OLD DATABASE

1. Go to https://vercel.com/dashboard
2. Click project: **mbita-emmanuel**
3. Go to **Storage** tab
4. Click on existing Postgres database
5. Go to **Settings** → **Delete Database**
6. Confirm deletion

---

## ✨ CREATE NEW DATABASE

### In Vercel Dashboard:

1. Go to **Storage** tab
2. Click **Create Database**
3. Select **Postgres** (Neon-powered)
4. **Database Name:** `mbita-db` (or your choice)
5. **Region:** US East 1 (Virginia) - recommended
6. Click **Create**

---

## 📋 AFTER DATABASE IS CREATED

### Vercel automatically creates these environment variables:

```
POSTGRES_URL
POSTGRES_PRISMA_URL ← This is the main one we need!
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

### You need to ADD these manually:

Go to **Settings** → **Environment Variables** → **Add New**

```
Name: SESSION_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: NEXTAUTH_SECRET
Value: 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: SKIP_ENV_VALIDATION
Value: true
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: NEXT_PUBLIC_BASE_URL
Value: https://mbita-emmanuel.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

---

## 🔧 COPY CONNECTION STRINGS TO LOCAL

After database is created, click on it and copy the connection strings.

You'll see something like:

```bash
# Pooled connection (for app)
POSTGRES_PRISMA_URL="postgresql://user:pass@host.aws.neon.tech/db?connect_timeout=15"

# Direct connection (for migrations)
POSTGRES_URL_NON_POOLING="postgresql://user:pass@host.aws.neon.tech/db"
```

**PASTE THESE CONNECTION STRINGS IN CHAT** so I can update your local `.env` file!

---

## 🚀 LOCAL SETUP COMMANDS

After I update your `.env`, run these commands:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run migrations (create tables)
npx prisma migrate deploy

# 3. Seed admin user
npx prisma db seed

# 4. Test admin login locally
node test-admin-login.mjs
```

---

## 🔐 ADMIN CREDENTIALS

After seeding:
- **Username:** Mbita
- **Password:** mbita@12345

---

## ✅ DEPLOY TO VERCEL

After everything works locally:

```bash
git add .
git commit -m "Configure new database"
git push origin main
```

Or manually redeploy in Vercel:
1. Go to **Deployments** tab
2. Click **three dots (...)** on latest deployment
3. Click **Redeploy**
4. **UNCHECK** "Use existing Build Cache"
5. Click **Redeploy**

---

## 🧪 TEST PRODUCTION

After deployment completes:
- Visit: https://mbita-emmanuel.vercel.app/admin
- Login with: `Mbita` / `mbita@12345`

---

## ❓ TROUBLESHOOTING

If you see errors:

1. **Build Error**: Check Vercel build logs
2. **Database Error**: Verify environment variables are set
3. **Login Error**: Check if seed ran successfully
4. **Connection Error**: Verify connection strings are correct

---

## 📞 NEXT STEPS

1. Delete old database in Vercel ✓
2. Create new database in Vercel ✓
3. Copy connection strings and paste here →
4. I'll update your local `.env` file →
5. Run migration commands →
6. Test locally →
7. Push to GitHub →
8. Verify on production ✓

