# 🚀 Deployment References & Documentation

## 📋 Project Overview

**Project Name:** Mbita Deogratias Emmanuel - Academic Platform
**Technology Stack:** Next.js 14, React, TypeScript, Tailwind CSS, PostgreSQL
**Deployment Platform:** Vercel
**Database:** Neon PostgreSQL (Serverless)
**Repository:** https://github.com/masalagosimon442-dotcom/Mbita-emmanuel

---

## 🔐 Admin Credentials

**Username:** `Mbita`
**Password:** `mbita@!12345`
**Email:** `mbita@university.edu`

**Login URL:** `https://your-site.vercel.app/login`
**Admin Dashboard:** `https://your-site.vercel.app/admin`

---

## 🗄️ Database Configuration

### **Database Provider:** Neon PostgreSQL
**Database Name:** Machiya
**Host:** ep-delicate-queen-ayjuc6e1-pooler.c-5.us-east-2.aws.neon.tech
**User:** neondb_owner
**Password:** npg_BMXlO3CKg6vw
**Region:** US East 2 (Ohio)
**Connection Type:** Pooled (optimized for serverless)

### **Connection String:**
```
postgresql://neondb_owner:npg_BMXlO3CKg6vw@ep-delicate-queen-ayjuc6e1-pooler.c-5.us-east-2.aws.neon.tech/Machiya?sslmode=require
```

### **Database Schema:**
- **Total Tables:** 116 tables
- **Key Models:** Profile, Student, Course, Research, Publication, AdminUser, SiteSettings
- **ORM:** Prisma 5.22.0
- **Migration Status:** All tables created and synced

---

## 🔧 Environment Variables (Required for Vercel)

### **1. POSTGRES_URL** (Database Connection)
```
POSTGRES_URL=postgresql://neondb_owner:npg_BMXlO3CKg6vw@ep-delicate-queen-ayjuc6e1-pooler.c-5.us-east-2.aws.neon.tech/Machiya?sslmode=require
```

### **2. NEXTAUTH_SECRET** (Session Encryption)
```
NEXTAUTH_SECRET=2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
```

**Note:** These are the PRIMARY variable names. The system also supports:
- `DATABASE_URL` (fallback for POSTGRES_URL)
- `SESSION_SECRET` (fallback for NEXTAUTH_SECRET)

---

## 📦 Prisma Configuration

### **Binary Targets:**
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
  output = "../node_modules/.prisma/client"
}
```

**Explanation:**
- `native` - For local development (Windows)
- `rhel-openssl-3.0.x` - For Vercel serverless environment
- `output` - Explicit path for consistent binary location

### **Datasource:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🏗️ Build Configuration

### **package.json Scripts:**
```json
{
  "build": "prisma generate && next build",
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && next build"
}
```

### **vercel.json:**
```json
{
  "functions": {
    "app/**/*.{js,ts,jsx,tsx}": {
      "includeFiles": "node_modules/.prisma/client/**"
    }
  }
}
```

**Purpose:** Ensures Prisma engine binaries are included in Vercel deployment

---

## 🎯 Platform Features (21 Major Features)

### **1. Academic Content Management:**
- Publications Database
- Research Projects Repository
- Teaching Materials & Courses
- Student Management & Supervision
- CV & Achievements Builder

### **2. Interactive Features:**
- AI Assistant (GPT-powered)
- Video Library
- Live Polling System
- Gamification & Badges
- Peer Review Platform

### **3. Communication:**
- Blog & News System
- Newsletter Management
- Events Calendar
- Contact Form with Inbox

### **4. Collaboration:**
- Collaboration Requests
- Team Management
- Resource Sharing
- Alumni Network

### **5. Analytics & Insights:**
- Impact Dashboard
- Analytics Tracking
- Funding Tracker
- Activity Logs

### **6. Advanced Features:**
- Auto-Sync Integration (Google Scholar, ORCID, GitHub)
- Scheduling & Appointments
- Certificates Generation
- Marketplace
- Virtual Lab
- Gallery Management

### **7. Admin Features:**
- **Navigation Control** - Show/hide navbar items
- Content Management System
- Settings & Configuration
- User Management
- Security & Backup
- Maintenance Mode

---

## 🔒 Security Features

### **Authentication:**
- Iron Session (encrypted cookies)
- bcrypt password hashing
- 8-hour session timeout
- Auto-logout on inactivity

### **Middleware Protection:**
- `/admin/*` routes require authentication
- `/api/admin/*` endpoints require authentication
- Automatic redirect to login if unauthorized

### **Session Configuration:**
```typescript
sessionOptions: {
  password: NEXTAUTH_SECRET,
  cookieName: "mbita_session",
  cookieOptions: {
    secure: true (production),
    httpOnly: true,
    maxAge: 8 hours,
    sameSite: "lax"
  }
}
```

---

## 📂 Project Structure

```
Mbita-emmanuel/
├── app/
│   ├── (public)/           # Public pages (21 feature pages)
│   ├── admin/              # Admin panel (30+ pages)
│   ├── api/                # API routes (63 endpoints)
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Navbar, Footer, AdminLayout
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── prisma.ts           # Prisma client initialization
│   ├── session.ts          # Session configuration
│   └── auto-sync.ts        # Auto-sync services
├── prisma/
│   └── schema.prisma       # Database schema (116 models)
├── public/                 # Static assets
├── .env                    # Environment variables (local)
├── vercel.json             # Vercel configuration
├── next.config.mjs         # Next.js configuration
└── package.json            # Dependencies & scripts
```

---

## 🚀 Deployment Process

### **Step 1: Vercel Setup**
1. Go to https://vercel.com/new
2. Import from GitHub: `masalagosimon442-dotcom/Mbita-emmanuel`
3. Framework: Next.js (auto-detected)
4. Root Directory: `./`

### **Step 2: Environment Variables**
Add these 2 variables:
- `POSTGRES_URL` = [database connection string]
- `NEXTAUTH_SECRET` = [session secret key]

Environment: Select "Production and Preview"

### **Step 3: Deploy**
Click "Deploy" button
- Build time: 2-3 minutes
- Vercel runs: `prisma generate` → `next build`
- Auto-deploys on every GitHub push

### **Step 4: Verify**
1. Check health: `/api/health`
2. Test login: `/login`
3. Access admin: `/admin`

---

## 🔄 Auto-Sync Integration

### **Supported Platforms:**
- Google Scholar (publications, citations)
- ORCID (research profile, works)
- GitHub (repositories, contributions)

### **Configuration:**
- Located in: `/integrations/connect`
- Sync frequency: Every 30 seconds (on page load)
- Database tables: `ConnectedAccount`, `SyncedContent`

### **Setup:**
1. Login to admin panel
2. Go to: `/integrations/connect`
3. Connect accounts (Google Scholar, ORCID, GitHub)
4. Content syncs automatically

---

## 📊 Admin Panel Overview

### **Main Sections (30+ pages):**

**Content:**
- Dashboard, Publications, Research, Teaching, Students
- Blog, Events, Gallery, CV

**Communication:**
- Messages, Notifications, Contact Requests

**Management:**
- Profile, About, Team, Collaborations
- Datasets, Presentations, Proposals

**System:**
- **Settings** (Navigation Control!)
- Analytics, Security, Backup
- Account Management

### **Navigation Control:**
Location: `/admin/settings`
Section: "Navigation Section Visibility"

**Controllable Items:**
- Home, About, Research, Teaching, Publications
- Students, CV, Blog, Collaborations, Gallery
- Contact, Login

**How it Works:**
- Check box = Show in navbar
- Uncheck box = Hide from navbar
- Saves to database `SiteSettings.hiddenSections`

---

## 🐛 Common Issues & Solutions

### **Issue 1: Prisma Engine Not Found**
**Error:** `Could not locate Query Engine for runtime "rhel-openssl-3.0.x"`

**Solution:**
- Ensure `binaryTargets` includes `"rhel-openssl-3.0.x"`
- Verify `vercel.json` includes Prisma client files
- Check `postinstall` script runs `prisma generate`

### **Issue 2: Database Connection Error**
**Error:** `Can't reach database server`

**Solution:**
- Verify `POSTGRES_URL` is set in Vercel
- Check connection string is correct
- Ensure Neon database is not suspended (free tier)

### **Issue 3: Admin Login Fails**
**Error:** `Internal server error`

**Solution:**
- Check database is connected (`/api/health`)
- Verify `NEXTAUTH_SECRET` is set
- Ensure admin account exists or will be auto-created
- Clear browser cache and try again

### **Issue 4: Build Fails**
**Error:** Build errors during deployment

**Solution:**
- Check Vercel build logs
- Ensure TypeScript/ESLint errors are allowed (`ignoreBuildErrors: true`)
- Verify all dependencies are in `package.json`
- Run `npm install` locally to check for issues

---

## 📞 Support & Resources

### **Documentation:**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs

### **Repository:**
- GitHub: https://github.com/masalagosimon442-dotcom/Mbita-emmanuel
- Issues: https://github.com/masalagosimon442-dotcom/Mbita-emmanuel/issues

### **Dashboards:**
- Vercel: https://vercel.com/dashboard
- Neon: https://console.neon.tech/

---

## 📝 File References

### **Key Configuration Files:**
- `prisma/schema.prisma` - Database schema (116 models)
- `lib/prisma.ts` - Prisma client with dynamic URL
- `lib/session.ts` - Session configuration
- `middleware.ts` - Route protection
- `app/api/auth/login/route.ts` - Login API with auto-create admin
- `app/admin/settings/page.tsx` - Navigation control UI
- `vercel.json` - Vercel deployment config
- `next.config.mjs` - Next.js configuration
- `package.json` - Build scripts & dependencies

### **Documentation Files:**
- `ADMIN-CREDENTIALS.txt` - Login credentials
- `VERCEL-ENV-VARIABLES.txt` - Environment variables
- `VERCEL-FINAL-SETUP.txt` - Deployment steps
- `PRISMA-VERCEL-FIX.txt` - Prisma engine fix notes
- `DEPLOYMENT-FINAL.md` - Complete deployment guide
- `TROUBLESHOOTING-LOGIN.md` - Login troubleshooting

---

## ✅ Pre-Deployment Checklist

- [x] Database created and tables pushed (116 tables)
- [x] Prisma binary targets configured
- [x] Environment variables documented
- [x] Admin authentication system implemented
- [x] Navigation control feature built
- [x] All 21 features implemented
- [x] Code pushed to GitHub
- [x] vercel.json configured
- [x] Build scripts optimized

---

## 🎉 Deployment Status

**Latest Commit:** Fix Prisma engine deployment - add vercel.json and explicit output path
**Date:** 2026-08-15
**Status:** Ready for production deployment
**GitHub:** Pushed and synced
**Vercel:** Auto-deploying (if connected)

---

**END OF REFERENCES**
