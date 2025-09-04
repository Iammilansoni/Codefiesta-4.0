@echo off
echo 🚀 Performance Testing Suite for Hackathon Website

echo.
echo 📊 Step 1: Building optimized production bundle...
call npm run build

echo.
echo 📈 Step 2: Analyzing bundle size...
call npx vite-bundle-analyzer dist

echo.
echo 🌐 Step 3: Starting preview server...
start cmd /k "npm run preview"

echo.
echo ⏱️ Step 4: Waiting for server to start...
timeout /t 5

echo.
echo 🔍 Step 5: Running Lighthouse audit...
call npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html --chrome-flags="--headless"

echo.
echo 📋 Step 6: Performance Summary
echo ================================
echo Bundle analysis: Check the opened browser tab
echo Lighthouse report: lighthouse-report.html
echo Preview server: http://localhost:4173
echo.
echo 🎯 Performance Targets:
echo - Bundle size: ^< 1.5MB
echo - FCP: ^< 1.5s  
echo - LCP: ^< 2.5s
echo - CLS: ^< 0.1
echo ================================

echo.
echo ✅ Performance testing complete!
echo Open lighthouse-report.html to view detailed results.

pause
