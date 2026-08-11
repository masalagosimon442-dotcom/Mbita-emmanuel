@echo off
echo ========================================
echo  ADDING ENVIRONMENT VARIABLES TO VERCEL
echo ========================================
echo.

cd /d d:\PROJECT1\Mbita-emmanuel

echo Adding DATABASE_URL...
echo.
echo When prompted, paste this:
echo postgresql://neondb_owner:npg_E2Pw5uVerBYf@ep-icy-river-aydef32t-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require
echo.
pause
call npx vercel env add DATABASE_URL production

echo.
echo Adding SESSION_SECRET...
echo.
echo When prompted, paste this:
echo 2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f
echo.
pause
call npx vercel env add SESSION_SECRET production

echo.
echo ========================================
echo  ENVIRONMENT VARIABLES ADDED!
echo  Now redeploying...
echo ========================================
echo.
call npx vercel --prod

echo.
echo DONE!
pause
