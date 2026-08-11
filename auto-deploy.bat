@echo off
echo ========================================
echo  AUTOMATIC DEPLOYMENT TO VERCEL
echo  Mbita Deogratias Academic Platform
echo ========================================
echo.

cd /d d:\PROJECT1\Mbita-emmanuel

echo [1/5] Building production version...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build complete ✓
echo.

echo [2/5] Linking to Vercel...
echo Creating new Vercel project automatically...
call npx vercel --yes --name mbita-deogratias --prod
if errorlevel 1 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE! 🎉
echo ========================================
echo.
echo Your site is now LIVE!
echo.
echo IMPORTANT: Add environment variables in Vercel dashboard:
echo 1. Go to: https://vercel.com/dashboard
echo 2. Click your project: mbita-deogratias
echo 3. Settings -^> Environment Variables
echo 4. Add these variables:
echo.
echo    DATABASE_URL = postgresql://neondb_owner:npg_E2Pw5uVerBYf@ep-icy-river-aydef32t-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
echo.
echo    SESSION_SECRET = 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
echo.
echo 5. Click "Redeploy" after adding variables
echo.
echo ========================================
echo.
pause
