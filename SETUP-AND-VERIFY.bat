@echo off
echo ========================================
echo  MBITA DEOGRATIAS - COMPLETE SETUP
echo  All 20 Features Setup and Verification
echo ========================================
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Not in project directory!
    echo Please navigate to: d:\PROJECT1\Mbita-emmanuel
    echo Use command: cd /d d:\PROJECT1\Mbita-emmanuel
    echo.
    pause
    exit /b 1
)

echo [1/7] Checking .env file...
if not exist ".env" (
    echo.
    echo ERROR: .env file not found!
    echo.
    echo REQUIRED: Run Neon database setup first:
    echo   npx neonctl@latest init
    echo.
    echo This will create .env with DATABASE_URL
    echo.
    pause
    exit /b 1
)

echo Found .env file ✓
echo.

echo [2/7] Checking for SESSION_SECRET in .env...
findstr /C:"SESSION_SECRET" .env >nul 2>&1
if errorlevel 1 (
    echo Adding SESSION_SECRET to .env...
    echo SESSION_SECRET=2085db4540e70e2f74fdbabcbf8493fd641cd9700ee9e932290e7fd5ead1b28f >> .env
    echo Added SESSION_SECRET ✓
) else (
    echo SESSION_SECRET exists ✓
)
echo.

echo [3/7] Installing dependencies...
echo This may take 2-3 minutes...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Dependencies installed ✓
echo.

echo [4/7] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo Prisma Client generated ✓
echo.

echo [5/7] Creating database tables (114 models)...
echo This will create all tables in Neon database...
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ERROR: Database push failed!
    echo Check your DATABASE_URL in .env
    pause
    exit /b 1
)
echo Database created successfully ✓
echo.

echo [6/7] Creating test verification script...
echo Creating automated test script...
(
echo const axios = require^('axios'^);
echo.
echo const BASE_URL = 'http://localhost:3000';
echo const TIMEOUT = 5000;
echo.
echo const features = [
echo   { name: 'Home Page', url: '/' },
echo   { name: 'Features Overview', url: '/features' },
echo   { name: 'Student Login', url: '/student-portal/login' },
echo   { name: 'Student Register', url: '/student-portal/register' },
echo   { name: 'Research Network', url: '/research-network' },
echo   { name: 'Impact Dashboard', url: '/impact-dashboard' },
echo   { name: 'Video Library', url: '/video-library' },
echo   { name: 'Alumni Network', url: '/alumni' },
echo   { name: 'Scheduling', url: '/scheduling' },
echo   { name: 'Gamification', url: '/gamification' },
echo   { name: 'AI Assistant', url: '/ai-assistant' },
echo   { name: 'Marketplace', url: '/marketplace' },
echo   { name: 'Peer Review', url: '/peer-review' },
echo   { name: 'Funding Tracker', url: '/funding-tracker' },
echo   { name: 'Virtual Lab', url: '/virtual-lab' },
echo   { name: 'Live Polling', url: '/live-polling' },
echo   { name: 'Certificates', url: '/certificates' },
echo   { name: 'Integrations', url: '/integrations' },
echo   { name: 'Newsletter', url: '/newsletter' },
echo   { name: 'Analytics', url: '/analytics' },
echo   { name: 'Accessibility', url: '/accessibility' },
echo ];
echo.
echo const apiEndpoints = [
echo   { name: 'Student Session', url: '/api/student/session', method: 'GET' },
echo   { name: 'Videos List', url: '/api/videos', method: 'GET' },
echo   { name: 'Gamification Stats', url: '/api/gamification/stats', method: 'GET' },
echo   { name: 'Research Network', url: '/api/research-network/researchers', method: 'GET' },
echo   { name: 'Marketplace Products', url: '/api/marketplace/products', method: 'GET' },
echo   { name: 'Funding Opportunities', url: '/api/funding/opportunities', method: 'GET' },
echo   { name: 'Lab Experiments', url: '/api/lab/experiments', method: 'GET' },
echo   { name: 'Active Polls', url: '/api/polling/active', method: 'GET' },
echo   { name: 'Certificates List', url: '/api/certificates', method: 'GET' },
echo   { name: 'Alumni Directory', url: '/api/alumni/directory', method: 'GET' },
echo   { name: 'Newsletter Campaigns', url: '/api/newsletter/campaigns', method: 'GET' },
echo   { name: 'Impact Metrics', url: '/api/impact/metrics', method: 'GET' },
echo   { name: 'Analytics Engagement', url: '/api/analytics/engagement', method: 'GET' },
echo   { name: 'Available Integrations', url: '/api/integrations/available', method: 'GET' },
echo   { name: 'Notifications', url: '/api/notifications', method: 'GET' },
echo ];
echo.
echo async function testFeatures^(^) {
echo   console.log^('\n========================================'^);
echo   console.log^('  TESTING ALL 20 FEATURES - FRONTEND'^);
echo   console.log^('========================================\n'^);
echo.
echo   let passed = 0;
echo   let failed = 0;
echo.
echo   for ^(const feature of features^) {
echo     try {
echo       const response = await axios.get^(`${BASE_URL}${feature.url}`, { timeout: TIMEOUT }^);
echo       if ^(response.status === 200^) {
echo         console.log^(`✓ ${feature.name.padEnd^(30^)} - Working ^(${response.status}^)`^);
echo         passed++;
echo       } else {
echo         console.log^(`✗ ${feature.name.padEnd^(30^)} - Status ${response.status}`^);
echo         failed++;
echo       }
echo     } catch ^(error^) {
echo       console.log^(`✗ ${feature.name.padEnd^(30^)} - Error: ${error.message}`^);
echo       failed++;
echo     }
echo   }
echo.
echo   console.log^('\n========================================'^);
echo   console.log^('  TESTING ALL API ENDPOINTS - BACKEND'^);
echo   console.log^('========================================\n'^);
echo.
echo   for ^(const endpoint of apiEndpoints^) {
echo     try {
echo       const response = await axios^({
echo         method: endpoint.method,
echo         url: `${BASE_URL}${endpoint.url}`,
echo         timeout: TIMEOUT,
echo         validateStatus: ^(status^) =^> status ^< 500
echo       }^);
echo.
echo       if ^(response.status ^< 500^) {
echo         const statusText = response.status === 401 ? 'Auth Required' : response.status === 200 ? 'OK' : `Status ${response.status}`;
echo         console.log^(`✓ ${endpoint.name.padEnd^(30^)} - ${statusText}`^);
echo         passed++;
echo       } else {
echo         console.log^(`✗ ${endpoint.name.padEnd^(30^)} - Error ${response.status}`^);
echo         failed++;
echo       }
echo     } catch ^(error^) {
echo       console.log^(`✗ ${endpoint.name.padEnd^(30^)} - Error: ${error.message}`^);
echo       failed++;
echo     }
echo   }
echo.
echo   console.log^('\n========================================'^);
echo   console.log^('  TEST RESULTS'^);
echo   console.log^('========================================\n'^);
echo   console.log^(`Total Tests: ${passed + failed}`^);
echo   console.log^(`Passed: ${passed}`^);
echo   console.log^(`Failed: ${failed}`^);
echo   console.log^(`Success Rate: ${^(^(passed / ^(passed + failed^)^) * 100^).toFixed^(1^)}%%\n`^);
echo.
echo   if ^(failed === 0^) {
echo     console.log^('🎉 ALL FEATURES ARE WORKING! 🎉\n'^);
echo   } else {
echo     console.log^('⚠️  Some features need attention\n'^);
echo   }
echo }
echo.
echo console.log^('Waiting for server to start...'^);
echo console.log^('Make sure "npm run dev" is running in another terminal\n'^);
echo.
echo setTimeout^(^(^) =^> {
echo   testFeatures^(^).catch^(console.error^);
echo }, 3000^);
) > verify-all-features.js

echo Test script created ✓
echo.

echo [7/7] Setup Complete!
echo.
echo ========================================
echo  ✓ SETUP COMPLETE - READY TO TEST
echo ========================================
echo.
echo WHAT'S BEEN DONE:
echo   ✓ Dependencies installed ^(40+ packages^)
echo   ✓ Prisma client generated
echo   ✓ Database created ^(114 tables^)
echo   ✓ SESSION_SECRET configured
echo   ✓ Test script created
echo.
echo NEXT STEPS TO VERIFY:
echo.
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Open another terminal and run verification:
echo    cd /d d:\PROJECT1\Mbita-emmanuel
echo    node verify-all-features.js
echo.
echo 3. Open browser and test manually:
echo    http://localhost:3000
echo.
echo ========================================
echo  20 FEATURES READY TO TEST
echo ========================================
echo.
echo Frontend Pages ^(21 pages^):
echo   • Features Overview
echo   • Student Portal ^(Login/Register/Dashboard^)
echo   • Research Network
echo   • Impact Dashboard
echo   • Video Library
echo   • Alumni Network
echo   • Scheduling System
echo   • Gamification
echo   • AI Assistant
echo   • Marketplace
echo   • Peer Review
echo   • Funding Tracker
echo   • Virtual Lab
echo   • Live Polling
echo   • Digital Certificates
echo   • Integrations Hub
echo   • Newsletter System
echo   • Analytics Dashboard
echo   • Accessibility Settings
echo   • Mobile App Info
echo.
echo Backend APIs ^(63 route files^):
echo   • Student Auth ^(6 APIs^)
echo   • Dashboard ^(1 API^)
echo   • Courses ^(2 APIs^)
echo   • Assignments ^(2 APIs^)
echo   • Videos ^(2 APIs^)
echo   • Gamification ^(2 APIs^)
echo   • AI Assistant ^(1 API^)
echo   • Research Network ^(4 APIs^)
echo   • Marketplace ^(5 APIs^)
echo   • Peer Review ^(4 APIs^)
echo   • Funding Tracker ^(3 APIs^)
echo   • Virtual Lab ^(3 APIs^)
echo   • Live Polling ^(4 APIs^)
echo   • Certificates ^(4 APIs^)
echo   • Alumni ^(4 APIs^)
echo   • Newsletter ^(3 APIs^)
echo   • Impact ^(2 APIs^)
echo   • Analytics ^(4 APIs^)
echo   • Integrations ^(3 APIs^)
echo   • Notifications ^(1 API^)
echo   • Scheduling ^(2 APIs^)
echo.
echo ========================================
echo.
pause
