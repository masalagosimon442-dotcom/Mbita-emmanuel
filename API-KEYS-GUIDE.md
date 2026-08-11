# 🔑 API Keys Guide - Required vs Optional

## 🎯 QUICK ANSWER

### ✅ REQUIRED (System Won't Work Without These):
1. **Database URL** - PostgreSQL connection
2. **Session Secret** - Already set!

### 🔵 OPTIONAL (Features Work Without Them):
3. **OpenAI API** - Only for AI Assistant feature
4. **Stripe API** - Only for Marketplace payments
5. **SMTP Email** - Only for email notifications

---

## 1. ✅ DATABASE URL (REQUIRED)

### What It's For:
- Store all data (students, courses, assignments, etc.)
- Required for ALL features to work

### How to Get:
**Option A: Neon (Free - Recommended)**
```bash
1. Go to: https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Connection string format:
postgresql://username:password@localhost:5432/database_name
```

### Add to .env:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### Cost: **FREE** (Neon free tier = 3GB storage, no sleep)

---

## 2. ✅ SESSION SECRET (ALREADY SET!)

### What It's For:
- Secure user sessions
- Login/logout functionality

### Current Value:
```env
SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"
```

### Status: ✅ **Already configured! No action needed.**

---

## 3. 🔵 OPENAI API (OPTIONAL)

### What It's For:
**ONLY** the AI Assistant feature (`/ai-assistant` page)

### Features That Work Without It:
- ✅ Student Portal
- ✅ Courses & Assignments
- ✅ Video Library
- ✅ Gamification
- ✅ Research Network
- ✅ Marketplace (product browsing)
- ✅ Peer Review
- ✅ Funding Tracker
- ✅ Virtual Lab
- ✅ Live Polling
- ✅ Certificates
- ✅ Alumni Network
- ✅ Newsletter
- ✅ Impact Dashboard
- ✅ Analytics
- ✅ Integrations
- ❌ **AI Assistant chat** (needs this key)

### How to Get:
```bash
1. Go to: https://platform.openai.com
2. Sign up
3. Go to API Keys section
4. Create new key
5. Copy the key (starts with "sk-")
```

### Add to .env:
```env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxx"
```

### Cost:
- **Free:** $5 credit for new accounts
- **Pay-as-you-go:** ~$0.002 per chat message
- **Monthly estimate:** $5-20 for light usage

### Without This Key:
- AI Assistant page still displays ✅
- Chat button shows "AI service not configured" ⚠️
- All other features work perfectly ✅

---

## 4. 🔵 STRIPE API (OPTIONAL)

### What It's For:
**ONLY** Marketplace payment processing

### Features That Work Without It:
- ✅ View products
- ✅ Browse marketplace
- ✅ See product details
- ❌ **Cannot purchase** (checkout will fail)

### How to Get:
```bash
1. Go to: https://dashboard.stripe.com
2. Sign up
3. Get API keys from Developers > API keys
4. Copy Secret Key (starts with "sk_")
5. Setup webhook for production
```

### Add to .env:
```env
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxx"
```

### Cost:
- **Free:** Test mode unlimited
- **Production:** 2.9% + $0.30 per transaction

### Without This Key:
- Product listing works ✅
- Product details work ✅
- Add to cart works ✅
- Checkout fails with "Payment system not configured" ⚠️

---

## 5. 🔵 SMTP EMAIL (OPTIONAL)

### What It's For:
- Contact form emails
- Newsletter sending
- Notification emails

### Features That Work Without It:
- ✅ All student portal features
- ✅ All learning features
- ✅ Contact form saves to database
- ❌ **Emails won't be sent** (but form still works)

### How to Get:
**Option A: Gmail (Free)**
```bash
1. Use your Gmail account
2. Enable "Less secure app access" OR
3. Use App Password (recommended)

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Option B: SendGrid (Free - Recommended)**
```bash
1. Go to: https://sendgrid.com
2. Sign up (free 100 emails/day)
3. Create API key
4. Use these settings:

SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Add to .env:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
PROFESSOR_EMAIL="professor@university.edu"
```

### Cost:
- **Gmail:** FREE
- **SendGrid:** FREE (100 emails/day)

### Without This:
- Contact form saves messages ✅
- No email sent to professor ⚠️
- Newsletter campaigns created ✅
- No emails delivered ⚠️

---

## 📊 FEATURE DEPENDENCY TABLE

| Feature | Database | Session | OpenAI | Stripe | SMTP |
|---------|----------|---------|--------|--------|------|
| Student Portal | ✅ | ✅ | - | - | - |
| Courses | ✅ | ✅ | - | - | - |
| Assignments | ✅ | ✅ | - | - | - |
| Video Library | ✅ | ✅ | - | - | - |
| Gamification | ✅ | ✅ | - | - | - |
| AI Assistant | ✅ | ✅ | ✅ | - | - |
| Research Network | ✅ | ✅ | - | - | - |
| Marketplace Browse | ✅ | ✅ | - | - | - |
| Marketplace Buy | ✅ | ✅ | - | ✅ | - |
| Peer Review | ✅ | ✅ | - | - | 🔵 |
| Funding Tracker | ✅ | ✅ | - | - | - |
| Virtual Lab | ✅ | ✅ | - | - | - |
| Live Polling | ✅ | ✅ | - | - | - |
| Certificates | ✅ | ✅ | - | - | - |
| Alumni Network | ✅ | ✅ | - | - | 🔵 |
| Newsletter | ✅ | ✅ | - | - | 🔵 |
| Impact Dashboard | ✅ | ✅ | - | - | - |
| Analytics | ✅ | ✅ | - | - | - |
| Integrations | ✅ | ✅ | - | - | - |
| Accessibility | - | - | - | - | - |
| Mobile App Info | - | - | - | - | - |

**Legend:**
- ✅ = Required
- 🔵 = Optional (feature degrades gracefully)
- \- = Not needed

---

## 🚀 RECOMMENDED DEPLOYMENT STRATEGY

### Phase 1: CORE (Everything Works)
```env
DATABASE_URL="postgresql://..."  ✅ Required
SESSION_SECRET="2085db..."        ✅ Already set
```

**Result:** 18 of 20 features fully working!

### Phase 2: ADD AI (If You Want AI Chat)
```env
OPENAI_API_KEY="sk-proj-..."     🔵 Optional
```

**Result:** 19 of 20 features working!

### Phase 3: ADD PAYMENTS (If You Want Marketplace Sales)
```env
STRIPE_SECRET_KEY="sk_test_..."  🔵 Optional
STRIPE_WEBHOOK_SECRET="whsec_..." 🔵 Optional
```

**Result:** All 20 features fully working!

### Phase 4: ADD EMAILS (For Notifications)
```env
SMTP_HOST="smtp.gmail.com"       🔵 Optional
SMTP_PORT="587"                  🔵 Optional
SMTP_USER="your@email.com"       🔵 Optional
SMTP_PASS="password"             🔵 Optional
```

**Result:** Email notifications enabled!

---

## 💰 COST BREAKDOWN

### FREE DEPLOYMENT (Recommended Start):
```
✅ Neon Database:        $0/month (3GB free)
✅ Vercel Hosting:       $0/month (100GB free)
✅ Session Secret:       $0 (generated)
-----------------------------------
Total:                   $0/month
Features Working:        18/20 (90%)
```

### WITH AI CHAT:
```
✅ Above free tier:      $0/month
🔵 OpenAI API:           $5-20/month (light usage)
-----------------------------------
Total:                   $5-20/month
Features Working:        19/20 (95%)
```

### FULL FEATURES (All Paid):
```
✅ Above free tier:      $0/month
🔵 OpenAI API:           $5-20/month
🔵 Stripe:               2.9% + $0.30 per sale
🔵 SendGrid:             $0/month (100 emails/day free)
-----------------------------------
Total:                   $5-20/month + transaction fees
Features Working:        20/20 (100%)
```

---

## 🎯 MY RECOMMENDATION

### Start With Minimum (FREE):
```env
# .env file
DATABASE_URL="postgresql://your-neon-url"
SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"
```

**Why?**
- ✅ Costs $0
- ✅ 90% of features work
- ✅ Can add other APIs later
- ✅ Test system first

### Add APIs Later When Needed:
1. **Week 1-2:** Deploy with free tier, test everything
2. **Week 3:** Add OpenAI if students want AI chat ($5-20/mo)
3. **Week 4:** Add Stripe if selling resources (per transaction)
4. **Week 5:** Add SMTP if need email notifications (free)

---

## ⚡ QUICK SETUP GUIDE

### Step 1: Get Database (Required)
```bash
# Go to neon.tech
# Sign up (free)
# Create project
# Copy DATABASE_URL
```

### Step 2: Create .env File
```bash
# Copy .env.example to .env
cp .env.example .env

# Add database URL
DATABASE_URL="postgresql://..."
SESSION_SECRET="2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"
```

### Step 3: Deploy
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
vercel --prod
```

### Step 4: Test
- Login/register ✅
- Browse courses ✅
- Watch videos ✅
- Submit assignments ✅
- Play with gamification ✅

### Step 5: Add Optional APIs (When Ready)
- Get OpenAI key → Add to .env → Redeploy
- Get Stripe keys → Add to .env → Redeploy
- Setup SMTP → Add to .env → Redeploy

---

## 🎊 FINAL ANSWER

### REQUIRED APIs: **2 items**
1. ✅ **Database URL** (Neon - FREE)
2. ✅ **Session Secret** (Already set - FREE)

### OPTIONAL APIs: **3 items**
3. 🔵 **OpenAI** - Only for AI chat ($5-20/mo)
4. 🔵 **Stripe** - Only for marketplace sales (per transaction)
5. 🔵 **SMTP** - Only for emails (FREE with Gmail/SendGrid)

### TO START: You only need **Database URL**!

**Everything else can be added later!** 🚀
