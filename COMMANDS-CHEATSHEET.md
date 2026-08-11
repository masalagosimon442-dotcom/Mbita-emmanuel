# ⚡ QUICK COMMANDS CHEATSHEET

## 🚀 INITIAL SETUP (Run Once)

```cmd
# 1. Navigate to project
cd /d d:\PROJECT1\Mbita-emmanuel

# 2. Initialize Neon database
npx neonctl@latest init

# 3. Complete setup (installs dependencies, creates tables)
SETUP-AND-VERIFY.bat
```

---

## 🔧 DAILY DEVELOPMENT

```cmd
# Start development server
npm run dev

# Start on specific port
npm run dev -- -p 4000

# Build for production
npm run build

# Start production server
npm start
```

---

## 📊 DATABASE COMMANDS

```cmd
# Generate Prisma client (after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open database GUI
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Seed database with sample data
npx prisma db seed
```

---

## 🧪 TESTING

```cmd
# Test all features automatically
node verify-all-features.js

# Run tests (if configured)
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

---

## 🔍 VERIFICATION

```cmd
# Check TypeScript compilation
npx tsc --noEmit

# Check for linting errors
npm run lint

# Check Prisma schema
npx prisma validate

# List all environment variables
type .env
```

---

## 📦 PACKAGE MANAGEMENT

```cmd
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update all packages
npm update

# Remove package
npm uninstall package-name

# Check for outdated packages
npm outdated
```

---

## 🚀 DEPLOYMENT

```cmd
# Deploy to Vercel (automated)
deploy-complete.bat

# Or manual Vercel deployment
npm install -g vercel
vercel

# Deploy to production
vercel --prod
```

---

## 🐛 DEBUGGING

```cmd
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 3000
taskkill /PID <PID> /F

# View all Node processes
tasklist | findstr node

# Clear npm cache (if weird errors)
npm cache clean --force

# Reinstall node_modules
rmdir /s /q node_modules
npm install
```

---

## 📝 GIT COMMANDS (Optional)

```cmd
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main

# Check status
git status

# View changes
git diff
```

---

## 🌐 ACCESS URLS

| Service | URL |
|---------|-----|
| **Development** | http://localhost:3000 |
| **Prisma Studio** | http://localhost:5555 |
| **API Endpoints** | http://localhost:3000/api/* |
| **Student Login** | http://localhost:3000/student-portal/login |
| **Features** | http://localhost:3000/features |

---

## 📋 FEATURE PAGES

```
# Main pages
/                              - Home page
/features                      - All features overview
/about                         - About page
/contact                       - Contact page

# Student Portal
/student-portal/login          - Student login
/student-portal/register       - Student registration
/student-portal/dashboard      - Student dashboard

# All 20 Features
/research-network              - Research collaboration
/impact-dashboard              - Publication metrics
/video-library                 - Video lectures
/alumni                        - Alumni network
/scheduling                    - Appointment booking
/gamification                  - Points & badges
/ai-assistant                  - AI chat
/marketplace                   - Resource marketplace
/peer-review                   - Peer review system
/funding-tracker               - Grant tracking
/virtual-lab                   - Lab notebook
/live-polling                  - Polls & quizzes
/certificates                  - Digital certificates
/integrations                  - External integrations
/newsletter                    - Newsletter campaigns
/analytics                     - Analytics dashboard
/accessibility                 - Accessibility tools
/mobile-app                    - Mobile app info
```

---

## 🔑 API ENDPOINTS

```
# Authentication
POST   /api/student/register
POST   /api/student/login
POST   /api/student/logout
GET    /api/student/session
GET    /api/student/profile
PUT    /api/student/profile
GET    /api/student/dashboard

# Videos
GET    /api/videos
GET    /api/videos/[id]
POST   /api/videos/[id]        # Track progress

# Gamification
GET    /api/gamification/stats
GET    /api/gamification/leaderboard

# AI Assistant
POST   /api/ai/chat

# Research Network
GET    /api/research-network/researchers
GET    /api/research-network/proposals
POST   /api/research-network/match

# Marketplace
GET    /api/marketplace/products
POST   /api/marketplace/checkout
GET    /api/marketplace/orders

# Certificates
POST   /api/certificates/generate
GET    /api/certificates
GET    /api/certificates/verify/[code]

# And 40+ more endpoints...
```

---

## 🔧 ENVIRONMENT VARIABLES

```env
# Required
DATABASE_URL="postgresql://..."     # From Neon
SESSION_SECRET="..."                # Auto-generated

# Optional (for extra features)
OPENAI_API_KEY="sk-..."            # AI Assistant
STRIPE_SECRET_KEY="sk_..."         # Marketplace
STRIPE_WEBHOOK_SECRET="whsec_..."  # Marketplace
SMTP_HOST="smtp.gmail.com"         # Email
SMTP_USER="your-email@gmail.com"   # Email
SMTP_PASS="your-password"          # Email
```

---

## 📊 TESTING CHECKLIST

```cmd
✅ npm run dev                     # Server starts
✅ http://localhost:3000           # Home loads
✅ http://localhost:3000/features  # Features page loads
✅ node verify-all-features.js     # All tests pass
✅ npx prisma studio               # Database opens
```

---

## 🎯 COMMON WORKFLOWS

### Add a New Feature Page:
```cmd
# 1. Create page file
# app/(public)/my-feature/page.tsx

# 2. Add to navigation
# components/navigation.tsx

# 3. Test
npm run dev
```

### Add a New API Endpoint:
```cmd
# 1. Create route file
# app/api/my-endpoint/route.ts

# 2. Define Zod schema for validation

# 3. Add Prisma query

# 4. Test with fetch or Postman
```

### Update Database Schema:
```cmd
# 1. Edit prisma/schema.prisma

# 2. Generate client
npx prisma generate

# 3. Push to database
npx prisma db push

# 4. Verify in Prisma Studio
npx prisma studio
```

---

## 🚨 EMERGENCY COMMANDS

```cmd
# Server won't start
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm run dev

# Database connection error
# Check .env file has DATABASE_URL
type .env

# Prisma client error
npx prisma generate
npm run dev

# Build error
rmdir /s /q .next
npm run build

# Fresh start (nuclear option)
rmdir /s /q node_modules
rmdir /s /q .next
npm install
npx prisma generate
npm run dev
```

---

## 📚 HELPFUL COMMANDS

```cmd
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list --depth=0

# Find package location
npm list package-name

# View package info
npm view package-name

# Check security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Open project in VS Code
code .
```

---

## 🎉 QUICK START SEQUENCE

```cmd
# Copy-paste these in order:
cd /d d:\PROJECT1\Mbita-emmanuel
npx neonctl@latest init
SETUP-AND-VERIFY.bat
npm run dev

# Open browser:
# http://localhost:3000
```

---

**💡 TIP:** Bookmark this page for quick reference!
