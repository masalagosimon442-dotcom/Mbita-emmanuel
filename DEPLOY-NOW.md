# 🚀 ONE-CLICK DEPLOYMENT

Choose ONE of these two scripts - they both do the same thing!

---

## ⚡ OPTION 1: PowerShell (Recommended)

**Right-click** `deploy-complete.ps1` → **Run with PowerShell**

Or open PowerShell and run:
```powershell
.\deploy-complete.ps1
```

**If you get an error about execution policy:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy-complete.ps1
```

---

## ⚡ OPTION 2: Command Prompt

**Double-click** `deploy-complete.bat`

Or open Command Prompt and run:
```cmd
deploy-complete.bat
```

---

## 📋 What You'll Need

Have these ready **before** running the script:

1. **GitHub account** (for login)
2. **Gmail account** with App Password:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Copy the 16-character password
3. **10 minutes** of your time

---

## 🎯 What the Script Does

The script will automatically:
1. ✅ Install Vercel and Neon CLIs
2. ✅ Login to both services (opens browser)
3. ✅ Create free PostgreSQL database
4. ✅ Deploy your site to Vercel
5. ✅ Configure all environment variables
6. ✅ Setup database tables and admin user
7. ✅ Open your live site in browser

---

## 📝 During Deployment

You'll be asked for:

| What | Example |
|------|---------|
| SMTP Host | `smtp.gmail.com` |
| SMTP Port | `587` |
| SMTP Username | `your-email@gmail.com` |
| SMTP Password | Your Gmail App Password |
| Professor Email | Where to receive contact forms |
| Project Name | `mbita-deogratias` |

Everything else is automatic!

---

## ✅ After Deployment

Your site will be live at: `https://your-project.vercel.app`

**Default Admin Login:**
- URL: `https://your-project.vercel.app/admin`
- Username: `Mbita`
- Password: `mbita@12345`

**⚠️ CHANGE PASSWORD IMMEDIATELY!**

---

## 🆘 If Something Goes Wrong

The script has error handling, but if it fails:

1. Check that Node.js is installed: `node --version`
2. Check that npm works: `npm --version`
3. Try manual deployment: See `COMMANDS.txt`
4. Check Vercel logs: `vercel logs`

---

## 🎉 That's It!

Just run the script and follow the prompts.

Your professor website will be live in 10 minutes!

**No credit card required. Free forever (for typical usage).**
