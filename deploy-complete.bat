@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo     COMPLETE DEPLOYMENT SCRIPT - Vercel + Neon
echo     Professor Website - One-Click Deploy
echo ============================================================
echo.
echo This script will:
echo  1. Install Vercel and Neon CLIs
echo  2. Login to both services
echo  3. Create database
echo  4. Deploy your site
echo  5. Configure environment variables
echo  6. Setup database schema
echo.
echo Estimated time: 10-15 minutes
echo.
pause

REM ============================================================
REM STEP 1: Install CLIs
REM ============================================================
echo.
echo [1/9] Installing Vercel CLI and Neon CLI...
echo.
call npm install -g vercel neonctl
if %errorlevel% neq 0 (
    echo ERROR: Failed to install CLIs
    echo Make sure Node.js is installed: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ CLIs installed successfully
pause

REM ============================================================
REM STEP 2: Login to Vercel
REM ============================================================
echo.
echo [2/9] Logging into Vercel...
echo.
echo A browser window will open. Please login with GitHub.
echo.
pause
call vercel login
if %errorlevel% neq 0 (
    echo ERROR: Vercel login failed
    pause
    exit /b 1
)
echo ✓ Logged into Vercel
pause

REM ============================================================
REM STEP 3: Login to Neon
REM ============================================================
echo.
echo [3/9] Logging into Neon...
echo.
echo A browser window will open. Please login with GitHub.
echo.
pause
call neonctl auth
if %errorlevel% neq 0 (
    echo ERROR: Neon login failed
    pause
    exit /b 1
)
echo ✓ Logged into Neon
pause

REM ============================================================
REM STEP 4: Create Neon Database
REM ============================================================
echo.
echo [4/9] Creating PostgreSQL database on Neon...
echo.
call neonctl projects create --name professor-website-db > neon-output.txt 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    type neon-output.txt
    del neon-output.txt
    pause
    exit /b 1
)
echo ✓ Database created
echo.
echo Getting connection string...
call neonctl connection-string > db-connection.txt 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to get connection string
    echo Run manually: neonctl connection-string
    pause
    exit /b 1
)
set /p DATABASE_URL=<db-connection.txt
echo.
echo ✓ Database connection string obtained
echo.
echo Your DATABASE_URL:
echo %DATABASE_URL%
echo.
echo IMPORTANT: Copy this connection string!
echo.
pause

REM ============================================================
REM STEP 5: Collect Environment Variables
REM ============================================================
echo.
echo [5/9] Setting up environment variables...
echo.
echo Please provide the following information:
echo.

REM Session Secret (already generated)
set SESSION_SECRET=2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
echo ✓ SESSION_SECRET: (auto-generated)

REM SMTP Settings
echo.
echo --- Email Configuration (for contact form) ---
echo.
set /p SMTP_HOST="SMTP Host (e.g., smtp.gmail.com): "
if "%SMTP_HOST%"=="" set SMTP_HOST=smtp.gmail.com

set /p SMTP_PORT="SMTP Port (default 587): "
if "%SMTP_PORT%"=="" set SMTP_PORT=587

set /p SMTP_USER="SMTP Username (your email): "

set /p SMTP_PASS="SMTP Password (Gmail App Password): "

set /p PROFESSOR_EMAIL="Professor's email (where to receive messages): "

echo.
echo --- Optional Settings (press Enter to skip) ---
echo.
set /p OPENAI_API_KEY="OpenAI API Key (for AI chatbot, optional): "
set /p TAWKTO_ID="Tawk.to ID (for live chat, optional): "
set /p ORCID_ID="ORCID ID (optional): "

echo.
echo ✓ Environment variables collected
pause

REM ============================================================
REM STEP 6: Initial Deploy
REM ============================================================
echo.
echo [6/9] Deploying to Vercel (first deployment)...
echo.
echo Please answer the prompts:
echo  - Set up and deploy? Y
echo  - Link to existing project? N
echo  - Project name? mbita-deogratias
echo  - Directory? (just press Enter)
echo  - Override settings? N
echo.
pause
call vercel --prod > deploy-output.txt 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    type deploy-output.txt
    del deploy-output.txt
    pause
    exit /b 1
)
echo ✓ Initial deployment successful
echo.
echo Your site URL will be shown above (like: https://mbita-emmanuel.vercel.app)
echo.
set /p VERCEL_URL="Enter your Vercel URL from above: "
echo.
pause

REM ============================================================
REM STEP 7: Add Environment Variables to Vercel
REM ============================================================
echo.
echo [7/9] Adding environment variables to Vercel...
echo.
echo This will prompt you for each variable.
echo When asked which environments, select: Production, Preview, Development (space to select, enter to confirm)
echo.
pause

echo Adding DATABASE_URL...
echo %DATABASE_URL% | call vercel env add DATABASE_URL production

echo Adding SESSION_SECRET...
echo %SESSION_SECRET% | call vercel env add SESSION_SECRET production

echo Adding NEXT_PUBLIC_BASE_URL...
echo %VERCEL_URL% | call vercel env add NEXT_PUBLIC_BASE_URL production

echo Adding SMTP_HOST...
echo %SMTP_HOST% | call vercel env add SMTP_HOST production

echo Adding SMTP_PORT...
echo %SMTP_PORT% | call vercel env add SMTP_PORT production

echo Adding SMTP_USER...
echo %SMTP_USER% | call vercel env add SMTP_USER production

echo Adding SMTP_PASS...
echo %SMTP_PASS% | call vercel env add SMTP_PASS production

echo Adding PROFESSOR_EMAIL...
echo %PROFESSOR_EMAIL% | call vercel env add PROFESSOR_EMAIL production

if not "%OPENAI_API_KEY%"=="" (
    echo Adding OPENAI_API_KEY...
    echo %OPENAI_API_KEY% | call vercel env add OPENAI_API_KEY production
)

if not "%TAWKTO_ID%"=="" (
    echo Adding NEXT_PUBLIC_TAWKTO_ID...
    echo %TAWKTO_ID% | call vercel env add NEXT_PUBLIC_TAWKTO_ID production
)

if not "%ORCID_ID%"=="" (
    echo Adding ORCID_ID...
    echo %ORCID_ID% | call vercel env add ORCID_ID production
)

echo Adding MFA_APP_NAME...
echo Professor Website | call vercel env add MFA_APP_NAME production

echo.
echo ✓ Environment variables added
pause

REM ============================================================
REM STEP 8: Redeploy with Environment Variables
REM ============================================================
echo.
echo [8/9] Redeploying with environment variables...
echo.
call vercel --prod
if %errorlevel% neq 0 (
    echo ERROR: Redeployment failed
    pause
    exit /b 1
)
echo ✓ Redeployment successful
pause

REM ============================================================
REM STEP 9: Setup Database Schema
REM ============================================================
echo.
echo [9/9] Setting up database schema and seed data...
echo.

REM Create local .env for Prisma
echo DATABASE_URL=%DATABASE_URL% > .env
echo SESSION_SECRET=%SESSION_SECRET% >> .env
echo NEXT_PUBLIC_BASE_URL=%VERCEL_URL% >> .env

echo Running Prisma generate...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)

echo.
echo Pushing database schema...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ERROR: Database push failed
    pause
    exit /b 1
)

echo.
echo Seeding database with initial data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ERROR: Database seed failed
    pause
    exit /b 1
)

echo.
echo ✓ Database setup complete

REM ============================================================
REM CLEANUP
REM ============================================================
if exist neon-output.txt del neon-output.txt
if exist db-connection.txt del db-connection.txt
if exist deploy-output.txt del deploy-output.txt

REM ============================================================
REM SUCCESS!
REM ============================================================
echo.
echo ============================================================
echo                  DEPLOYMENT COMPLETE! 🎉
echo ============================================================
echo.
echo Your website is now live at:
echo %VERCEL_URL%
echo.
echo Admin Panel:
echo %VERCEL_URL%/admin
echo.
echo Default Login:
echo Username: Mbita
echo Password: mbita@12345
echo.
echo ⚠️  IMPORTANT: Login and change your password immediately!
echo.
echo ============================================================
echo.
echo Next steps:
echo 1. Visit your site and test it
echo 2. Login to admin panel
echo 3. Change the default password
echo 4. Update your profile information
echo 5. Start adding content
echo.
echo To redeploy in the future:
echo   vercel --prod
echo.
echo To view logs:
echo   vercel logs
echo.
echo To view database:
echo   npx prisma studio
echo.
echo ============================================================
echo.
pause

REM Open browser
echo Opening your site in browser...
start %VERCEL_URL%

echo.
echo All done! Enjoy your new website!
echo.
pause
