@echo off
echo ========================================
echo   Import .env to Vercel
echo ========================================
echo.
echo This will import your .env file to Vercel
echo.

vercel env pull .env.vercel.local

echo.
echo Now pushing to Vercel...
echo.

echo To manually add, go to:
echo https://vercel.com/mmaige665-2013s-projects/mbita-emmanuel/settings/environment-variables
echo.
echo Click "Add New" then "Paste .env" and paste your .env file content
echo.
pause
