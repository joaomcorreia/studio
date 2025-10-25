@echo off
echo =====================================
echo  JCW v0 - Complete Testing Guide
echo =====================================
echo.

echo Choose your testing approach:
echo.
echo [1] Quick Setup + Test (Recommended)
echo [2] Manual Step-by-Step
echo [3] Live Demo Testing
echo [4] API Testing Only
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto quick_test
if "%choice%"=="2" goto manual_test
if "%choice%"=="3" goto demo_test
if "%choice%"=="4" goto api_test

:quick_test
echo.
echo =====================================
echo  OPTION 1: Quick Setup + Test
echo =====================================
echo.
echo This will:
echo - Set up Django backend with dependencies
echo - Initialize database and seed demo data
echo - Set up Next.js frontend
echo - Run basic validation tests
echo.
pause
call setup_full.cmd
goto end

:manual_test
echo.
echo =====================================
echo  OPTION 2: Manual Step-by-Step
echo =====================================
echo.
echo Step 1: Test Project Structure
echo ------------------------------
python test_simple.py
echo.
pause

echo Step 2: Setup Django Backend
echo -----------------------------
echo Run these commands:
echo   cd apps\api
echo   python -m venv venv
echo   venv\Scripts\activate
echo   pip install -r requirements.txt
echo   python manage.py migrate
echo   python manage.py seed_demo
echo.
pause

echo Step 3: Test Django
echo -------------------
echo   python manage.py runserver
echo   Open: http://127.0.0.1:8000/admin/
echo   Login: admin@jcw.com / admin123
echo.
pause

echo Step 4: Setup Next.js Frontend
echo -------------------------------
echo   cd ..\web
echo   npm install
echo   npm run dev
echo   Open: http://127.0.0.1:3000/
echo.
pause
goto end

:demo_test
echo.
echo =====================================
echo  OPTION 3: Live Demo Testing
echo =====================================
echo.
echo Make sure both servers are running first:
echo   1. Django: python manage.py runserver (port 8000)
echo   2. Next.js: npm run dev (port 3000)
echo.
echo Then test these URLs:
echo.
echo MAIN PLATFORM:
echo   http://127.0.0.1:3000/                    # Landing page
echo   http://127.0.0.1:3000/build               # Onboarding form
echo   http://127.0.0.1:3000/dashboard/admin     # Admin dashboard
echo   http://127.0.0.1:3000/dashboard/user      # User dashboard
echo.
echo DEMO TENANT:
echo   http://marysrestaurant.lvh.me:3000/       # Demo tenant site
echo.
echo BACKEND:
echo   http://127.0.0.1:8000/admin/              # Django admin
echo   http://127.0.0.1:8000/api/                # API root
echo.
echo LOGIN CREDENTIALS:
echo   Admin: admin@jcw.com / admin123
echo.
pause
goto end

:api_test
echo.
echo =====================================
echo  OPTION 4: API Testing Only
echo =====================================
echo.
echo Test these API endpoints (use Postman/curl):
echo.
echo POST http://127.0.0.1:8000/api/onboarding/check-slug/
echo Body: {"business_name": "Test Restaurant"}
echo.
echo POST http://127.0.0.1:8000/api/onboarding/start/
echo Body: {
echo   "business_name": "API Test Restaurant",
echo   "contact_email": "test@example.com",
echo   "industry_category": "restaurant"
echo }
echo.
echo GET http://127.0.0.1:8000/api/admin/stats/
echo GET http://127.0.0.1:8000/api/admin/tenants/
echo GET http://127.0.0.1:8000/api/sections/
echo GET http://127.0.0.1:8000/api/templates/
echo GET http://127.0.0.1:8000/api/pages/
echo.
pause
goto end

:end
echo.
echo =====================================
echo  Testing Complete!
echo =====================================
echo.
echo For ongoing development:
echo   - Run: dev_servers.cmd (starts both servers)
echo   - Test: python test_simple.py (validation)
echo   - Reset: del apps\api\db.sqlite3 ^&^& init_db.cmd
echo.
pause