@echo off
echo ========================================
echo  AUTOMATIC DEPLOYMENT - ONE COMMAND
echo ========================================
echo.

cd /d d:\PROJECT1\Mbita-emmanuel

echo [1/4] Unlinking old project...
call npx vercel unlink --yes 2>nul

echo.
echo [2/4] Creating new deployment...
echo.
echo Running automatic deployment with environment variables...
echo.

REM Create a temporary project.json with correct settings
echo {"name":"mbita-emmanuel","rootDirectory":"","buildCommand":"prisma generate && next build","framework":"nextjs"} > .vercel-temp.json

REM Deploy with automatic yes to all prompts
(
echo Y
echo mmaige665-2013s-projects
echo N
echo mbita-emmanuel
echo.
echo N
) | npx vercel --prod --yes

echo.
echo [3/4] Project deployed! Now adding environment variables via API...
echo.

REM Use Vercel API to add environment variables
curl -X POST "https://api.vercel.com/v10/projects/mbita-emmanuel/env" ^
  -H "Authorization: Bearer %VERCEL_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"key\":\"DATABASE_URL\",\"value\":\"postgresql://neondb_owner:npg_E2Pw5uVerBYf@ep-icy-river-aydef32t-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require\",\"type\":\"encrypted\",\"target\":[\"production\"]}"

curl -X POST "https://api.vercel.com/v10/projects/mbita-emmanuel/env" ^
  -H "Authorization: Bearer %VERCEL_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"key\":\"SESSION_SECRET\",\"value\":\"2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f\",\"type\":\"encrypted\",\"target\":[\"production\"]}"

echo.
echo [4/4] Redeploying with environment variables...
call npx vercel --prod

echo.
echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
pause
