# Complete Deployment Script - PowerShell Version
# Professor Website - One-Click Deploy

# Enable strict mode
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "============================================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Welcome
Clear-Host
Write-Step "COMPLETE DEPLOYMENT SCRIPT - Vercel + Neon"
Write-Host "This script will:`n"
Write-Host "  1. Install Vercel and Neon CLIs"
Write-Host "  2. Login to both services"
Write-Host "  3. Create database"
Write-Host "  4. Deploy your site"
Write-Host "  5. Configure environment variables"
Write-Host "  6. Setup database schema`n"
Write-Host "Estimated time: 10-15 minutes`n"
Read-Host "Press Enter to continue"

# ============================================================
# STEP 1: Install CLIs
# ============================================================
Write-Step "[1/9] Installing Vercel CLI and Neon CLI..."
try {
    npm install -g vercel neonctl
    Write-Success "CLIs installed successfully"
} catch {
    Write-Error-Custom "Failed to install CLIs. Make sure Node.js is installed: https://nodejs.org"
    Read-Host "Press Enter to exit"
    exit 1
}
Read-Host "Press Enter to continue"

# ============================================================
# STEP 2: Login to Vercel
# ============================================================
Write-Step "[2/9] Logging into Vercel..."
Write-Host "A browser window will open. Please login with GitHub.`n"
Read-Host "Press Enter to open browser"
try {
    vercel login
    Write-Success "Logged into Vercel"
} catch {
    Write-Error-Custom "Vercel login failed"
    Read-Host "Press Enter to exit"
    exit 1
}
Read-Host "Press Enter to continue"

# ============================================================
# STEP 3: Login to Neon
# ============================================================
Write-Step "[3/9] Logging into Neon..."
Write-Host "A browser window will open. Please login with GitHub.`n"
Read-Host "Press Enter to open browser"
try {
    neonctl auth
    Write-Success "Logged into Neon"
} catch {
    Write-Error-Custom "Neon login failed"
    Read-Host "Press Enter to exit"
    exit 1
}
Read-Host "Press Enter to continue"

# ============================================================
# STEP 4: Create Neon Database
# ============================================================
Write-Step "[4/9] Creating PostgreSQL database on Neon..."
try {
    neonctl projects create --name professor-website-db | Out-Null
    Write-Success "Database created"
    
    Write-Host "`nGetting connection string..."
    $DATABASE_URL = (neonctl connection-string) | Out-String
    $DATABASE_URL = $DATABASE_URL.Trim()
    
    Write-Success "Database connection string obtained"
    Write-Host "`nYour DATABASE_URL:" -ForegroundColor Yellow
    Write-Host $DATABASE_URL -ForegroundColor Yellow
    Write-Host "`nIMPORTANT: This has been saved!" -ForegroundColor Yellow
} catch {
    Write-Error-Custom "Failed to create database"
    Read-Host "Press Enter to exit"
    exit 1
}
Read-Host "Press Enter to continue"

# ============================================================
# STEP 5: Collect Environment Variables
# ============================================================
Write-Step "[5/9] Setting up environment variables..."

# Session Secret (auto-generated)
$SESSION_SECRET = "2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f"
Write-Success "SESSION_SECRET: (auto-generated)"

# SMTP Settings
Write-Host "`n--- Email Configuration (for contact form) ---`n" -ForegroundColor Yellow
$SMTP_HOST = Read-Host "SMTP Host (default: smtp.gmail.com)"
if ([string]::IsNullOrWhiteSpace($SMTP_HOST)) { $SMTP_HOST = "smtp.gmail.com" }

$SMTP_PORT = Read-Host "SMTP Port (default: 587)"
if ([string]::IsNullOrWhiteSpace($SMTP_PORT)) { $SMTP_PORT = "587" }

$SMTP_USER = Read-Host "SMTP Username (your email)"

$SMTP_PASS = Read-Host "SMTP Password (Gmail App Password)" -AsSecureString
$SMTP_PASS = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SMTP_PASS))

$PROFESSOR_EMAIL = Read-Host "Professor's email (where to receive messages)"

# Optional
Write-Host "`n--- Optional Settings (press Enter to skip) ---`n" -ForegroundColor Yellow
$OPENAI_API_KEY = Read-Host "OpenAI API Key (for AI chatbot, optional)"
$TAWKTO_ID = Read-Host "Tawk.to ID (for live chat, optional)"
$ORCID_ID = Read-Host "ORCID ID (optional)"

Write-Success "Environment variables collected"
Read-Host "Press Enter to continue"

# ============================================================
# STEP 6: Initial Deploy
# ============================================================
Write-Step "[6/9] Deploying to Vercel (first deployment)..."
Write-Host "Please answer the prompts:" -ForegroundColor Yellow
Write-Host "  - Set up and deploy? Y"
Write-Host "  - Link to existing project? N"
Write-Host "  - Project name? mbita-deogratias"
Write-Host "  - Directory? (just press Enter)"
Write-Host "  - Override settings? N`n"
Read-Host "Press Enter to start deployment"

try {
    vercel --prod
    Write-Success "Initial deployment successful"
} catch {
    Write-Error-Custom "Deployment failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nYour site URL is shown above (like: https://mbita-emmanuel.vercel.app)" -ForegroundColor Yellow
$VERCEL_URL = Read-Host "`nEnter your Vercel URL from above"
Read-Host "Press Enter to continue"

# ============================================================
# STEP 7: Add Environment Variables to Vercel
# ============================================================
Write-Step "[7/9] Adding environment variables to Vercel..."
Write-Host "Adding variables to production environment...`n"

$envVars = @{
    "DATABASE_URL" = $DATABASE_URL
    "SESSION_SECRET" = $SESSION_SECRET
    "NEXT_PUBLIC_BASE_URL" = $VERCEL_URL
    "SMTP_HOST" = $SMTP_HOST
    "SMTP_PORT" = $SMTP_PORT
    "SMTP_USER" = $SMTP_USER
    "SMTP_PASS" = $SMTP_PASS
    "PROFESSOR_EMAIL" = $PROFESSOR_EMAIL
    "MFA_APP_NAME" = "Professor Website"
}

if (![string]::IsNullOrWhiteSpace($OPENAI_API_KEY)) {
    $envVars["OPENAI_API_KEY"] = $OPENAI_API_KEY
}
if (![string]::IsNullOrWhiteSpace($TAWKTO_ID)) {
    $envVars["NEXT_PUBLIC_TAWKTO_ID"] = $TAWKTO_ID
}
if (![string]::IsNullOrWhiteSpace($ORCID_ID)) {
    $envVars["ORCID_ID"] = $ORCID_ID
}

foreach ($key in $envVars.Keys) {
    Write-Host "Adding $key..." -ForegroundColor Gray
    $value = $envVars[$key]
    # Use echo to pipe value to vercel env add
    $null = Write-Output $value | vercel env add $key production 2>&1
}

Write-Success "Environment variables added"
Read-Host "Press Enter to continue"

# ============================================================
# STEP 8: Redeploy with Environment Variables
# ============================================================
Write-Step "[8/9] Redeploying with environment variables..."
try {
    vercel --prod
    Write-Success "Redeployment successful"
} catch {
    Write-Error-Custom "Redeployment failed"
    Read-Host "Press Enter to exit"
    exit 1
}
Read-Host "Press Enter to continue"

# ============================================================
# STEP 9: Setup Database Schema
# ============================================================
Write-Step "[9/9] Setting up database schema and seed data..."

# Create local .env for Prisma
@"
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
NEXT_PUBLIC_BASE_URL=$VERCEL_URL
"@ | Out-File -FilePath ".env" -Encoding UTF8

try {
    Write-Host "Running Prisma generate..."
    npx prisma generate
    
    Write-Host "`nPushing database schema..."
    npx prisma db push --accept-data-loss
    
    Write-Host "`nSeeding database with initial data..."
    npx prisma db seed
    
    Write-Success "Database setup complete"
} catch {
    Write-Error-Custom "Database setup failed: $_"
    Read-Host "Press Enter to continue anyway"
}

# ============================================================
# SUCCESS!
# ============================================================
Clear-Host
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "                DEPLOYMENT COMPLETE! 🎉" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Green

Write-Host "Your website is now live at:" -ForegroundColor Cyan
Write-Host $VERCEL_URL -ForegroundColor Yellow
Write-Host "`nAdmin Panel:" -ForegroundColor Cyan
Write-Host "$VERCEL_URL/admin" -ForegroundColor Yellow

Write-Host "`nDefault Login:" -ForegroundColor Cyan
Write-Host "Username: Mbita" -ForegroundColor White
Write-Host "Password: mbita@12345" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT: Login and change your password immediately!" -ForegroundColor Red

Write-Host "`n============================================================`n" -ForegroundColor Green

Write-Host "Next steps:"
Write-Host "1. Visit your site and test it"
Write-Host "2. Login to admin panel"
Write-Host "3. Change the default password"
Write-Host "4. Update your profile information"
Write-Host "5. Start adding content"

Write-Host "`nUseful commands:" -ForegroundColor Cyan
Write-Host "  vercel --prod        # Redeploy"
Write-Host "  vercel logs          # View logs"
Write-Host "  npx prisma studio    # View database`n"

Write-Host "============================================================`n" -ForegroundColor Green

Read-Host "Press Enter to open your site in browser"

# Open browser
Start-Process $VERCEL_URL

Write-Host "`nAll done! Enjoy your new website!`n" -ForegroundColor Green
Read-Host "Press Enter to exit"
