@echo off
echo ========================================
echo  SIMPLE ONE-COMMAND DEPLOYMENT
echo ========================================
echo.

cd /d d:\PROJECT1\Mbita-emmanuel

echo This will:
echo 1. Push your code to GitHub
echo 2. Vercel will auto-deploy from GitHub
echo.
echo Make sure Vercel GitHub integration is enabled!
echo.
pause

echo.
echo [1/3] Committing changes...
git add .
git commit -m "Deploy with all features" --allow-empty

echo.
echo [2/3] Pushing to GitHub...
git push origin main

echo.
echo [3/3] Done! 
echo.
echo Vercel will automatically detect the push and deploy.
echo Check your deployment at:
echo https://vercel.com/mmaige665-2013s-projects/mbita-emmanuel
echo.
echo Remember to add environment variables in Vercel dashboard:
echo https://vercel.com/mmaige665-2013s-projects/mbita-emmanuel/settings/environment-variables
echo.
echo DATABASE_URL and SESSION_SECRET
echo.
pause
