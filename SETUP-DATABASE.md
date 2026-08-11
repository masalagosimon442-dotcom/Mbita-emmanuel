# 🗄️ DATABASE SETUP USING NEON CLI

## ✅ STEP-BY-STEP: Setup Database with Neon CLI

---

## STEP 1: Initialize Neon Database

Open your terminal in the project folder and run:

```bash
cd d:\PROJECT1\Mbita-emmanuel
npx neonctl@latest init
```

---

## STEP 2: Follow the Interactive Prompts

The CLI will ask you several questions:

### Question 1: "Do you want to sign up or log in?"
**Choose:** `Sign up` (if new) or `Log in` (if you have account)

### Question 2: "How do you want to authenticate?"
**Choose:** `GitHub` (easiest) or `Email`

**Browser will open** → Sign in with GitHub or Email

### Question 3: "Enter a name for your project"
**Type:** `mbita-deogratias`
**Press:** Enter

### Question 4: "Select a region"
**Choose:** Closest region to you
- US East (Ohio) - `aws-us-east-2`
- US West (Oregon) - `aws-us-west-2`
- Europe (Frankfurt) - `aws-eu-central-1`
- Asia Pacific (Singapore) - `aws-ap-southeast-1`

### Question 5: "Select PostgreSQL version"
**Choose:** `16` (default - latest)

### Question 6: "Store connection string in .env?"
**Choose:** `Yes` ✅

This will automatically create `.env` file with your DATABASE_URL!

---

## STEP 3: Verify .env File Was Created

Check if `.env` file exists:

```bash
type .env
```

You should see something like:
```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

✅ **Perfect! Your database URL is set!**

---

## STEP 4: Add Session Secret to .env

Open `.env` file and add the session secret:

```bash
notepad .env
```

Add this line at the end:
```env
SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"
```

Save and close the file.

---

## STEP 5: Generate Prisma Client

```bash
npx prisma generate
```

Expected output:
```
✔ Generated Prisma Client
```

---

## STEP 6: Push Database Schema

```bash
npx prisma db push
```

This will create all 114 tables in your database!

Expected output:
```
Your database is now in sync with your Prisma schema. Done in XXXms
✔ Generated Prisma Client
```

---

## STEP 7: (Optional) View Your Database

Open Prisma Studio to see your database:

```bash
npx prisma studio
```

Browser opens at `http://localhost:5555`
- You can see all your tables
- Browse data
- Add test data

Press `Ctrl+C` to stop Prisma Studio

---

## ✅ VERIFICATION

Your `.env` file should now look like this:

```env
# Database (automatically added by neonctl)
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Session Secret (manually added)
SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"

# Optional APIs (add later if needed)
# OPENAI_API_KEY=""
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""
# SMTP_HOST=""
# SMTP_PORT=""
# SMTP_USER=""
# SMTP_PASS=""
# PROFESSOR_EMAIL=""
# NEXT_PUBLIC_BASE_URL=""
```

---

## 🎯 COMPLETE SETUP SCRIPT

Run all commands at once:

```bash
# Navigate to project
cd d:\PROJECT1\Mbita-emmanuel

# Initialize Neon database (follow prompts)
npx neonctl@latest init

# Add session secret to .env
echo SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f" >> .env

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Build project
npm run build

# Start dev server (optional - to test)
npm run dev
```

---

## 🚀 WHAT'S NEXT?

After database setup, you can:

### Option 1: Test Locally
```bash
npm run dev
```
Visit: `http://localhost:3000`

### Option 2: Deploy to Vercel
```bash
vercel --prod
```

### Option 3: Seed Sample Data (Optional)
Create some test data:
```bash
npx prisma db seed
```

---

## 🔧 TROUBLESHOOTING

### Issue 1: "neonctl command not found"
**Solution:** The command uses `npx` which downloads it automatically. Make sure you have Node.js installed.

### Issue 2: ".env already exists"
**Solution:** 
```bash
# Backup existing .env
copy .env .env.backup

# Remove old .env
del .env

# Run neonctl init again
npx neonctl@latest init
```

### Issue 3: "Failed to connect to database"
**Solution:** Check your `.env` file has correct DATABASE_URL

### Issue 4: "Prisma client not generated"
**Solution:**
```bash
npx prisma generate
```

---

## 📊 WHAT NEONCTL CREATES

When you run `npx neonctl@latest init`, it:

1. ✅ Creates Neon account (if new)
2. ✅ Creates new PostgreSQL database
3. ✅ Creates `.env` file automatically
4. ✅ Adds DATABASE_URL to `.env`
5. ✅ Configures connection with SSL
6. ✅ Sets up database ready to use

**Benefits:**
- 🚀 Faster than manual setup
- ✅ No copy-paste errors
- 🔒 Secure SSL connection
- 📝 Automatic `.env` creation

---

## 💰 NEON FREE TIER LIMITS

Your free database includes:
- ✅ 3 GB storage
- ✅ Unlimited compute hours
- ✅ No sleep (always on)
- ✅ Automatic backups
- ✅ Point-in-time recovery

**Cost:** $0/month forever! 🎉

---

## ✨ FINAL CHECK

Verify everything is set up:

```bash
# Check .env exists
type .env

# Check Prisma client
npx prisma validate

# Check database connection
npx prisma db push --accept-data-loss

# Start app
npm run dev
```

If all commands succeed, you're ready to deploy! 🚀

---

## 🎊 SUCCESS!

Your database is now:
- ✅ Created on Neon
- ✅ Connected to your app
- ✅ Schema deployed (114 tables)
- ✅ Ready for production

**Next:** Add optional APIs (OpenAI, Stripe, SMTP) or deploy immediately!
