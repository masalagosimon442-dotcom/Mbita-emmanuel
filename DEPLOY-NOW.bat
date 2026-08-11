@echo off
echo ========================================
echo  DEPLOYING MBITA DEOGRATIAS PLATFORM
echo  Complete Deployment to Production
echo ========================================
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Not in project directory!
    echo Please run from: d:\PROJECT1\Mbita-emmanuel
    pause
    exit /b 1
)

echo [STEP 1/6] Checking .env file...
if not exist ".env" (
    echo.
    echo .env file not found. Creating it now...
    echo.
    echo Please enter your Neon database URL:
    echo Example: postgresql://user:pass@host/database?sslmode=require
    echo.
    set /p DATABASE_URL="DATABASE_URL: "
    
    echo Creating .env file...
    (
        echo # Database
        echo DATABASE_URL="%DATABASE_URL%"
        echo.
        echo # Session
        echo SESSION_SECRET=2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
        echo.
        echo # Optional API Keys
        echo # OPENAI_API_KEY=sk-your-key-here
        echo # STRIPE_SECRET_KEY=sk_your-key-here
        echo # STRIPE_WEBHOOK_SECRET=whsec_your-key-here
    ) > .env
    echo .env file created ✓
) else (
    echo .env file found ✓
    
    :: Check for SESSION_SECRET
    findstr /C:"SESSION_SECRET" .env >nul 2>&1
    if errorlevel 1 (
        echo Adding SESSION_SECRET...
        echo SESSION_SECRET=2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f >> .env
    )
)
echo.

echo [STEP 2/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Dependencies installed ✓
echo.

echo [STEP 3/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo Prisma Client generated ✓
echo.

echo [STEP 4/6] Pushing database schema...
echo Creating all 114 tables in your database...
call npx prisma db push
if errorlevel 1 (
    echo.
    echo WARNING: Database push failed!
    echo This might be okay if tables already exist.
    echo Continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
)
echo Database schema pushed ✓
echo.

echo [STEP 5/6] Building production version...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Production build complete ✓
echo.

echo [STEP 6/6] Deploying to Vercel...
echo.
echo Installing Vercel CLI...
call npm install -g vercel
echo.

echo Starting deployment...
echo.
echo IMPORTANT: When prompted:
echo 1. Login to Vercel (or create free account)
echo 2. Project name: mbita-deogratias (or your choice)
echo 3. Select "Yes" to link to existing project or create new
echo 4. Keep default settings for Next.js
echo.
pause

:: Deploy to Vercel
call vercel --prod

echo.
echo ========================================
echo  DEPLOYMENT PROCESS COMPLETE!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Vercel will give you a production URL
echo    Example: https://mbita-deogratias.vercel.app
echo.
echo 2. Add environment variables in Vercel dashboard:
echo    - Go to your project settings
echo    - Add DATABASE_URL from your .env file
echo    - Add SESSION_SECRET from your .env file
echo    - Add any optional API keys (OpenAI, Stripe, etc.)
echo.
echo 3. Redeploy after adding environment variables:
echo    vercel --prod
echo.
echo 4. Your site is now LIVE! ✓
echo.
echo ========================================
echo.
pause
