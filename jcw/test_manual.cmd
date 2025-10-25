@echo off
echo ===============================================
echo  JCW v0 - Manual Testing Guide
echo ===============================================
echo.

echo Step 1: Setup Django API
echo --------------------------
echo Run: cd apps\api
echo Run: python -m venv venv
echo Run: venv\Scripts\activate
echo Run: pip install -r requirements.txt
echo Run: python manage.py makemigrations
echo Run: python manage.py migrate
echo Run: python manage.py seed_demo
echo.

echo Step 2: Test Django API
echo -----------------------
echo Run: python manage.py runserver
echo Test: http://127.0.0.1:8000/api/
echo Test: http://127.0.0.1:8000/admin/ (admin@jcw.com / admin123)
echo.

echo Step 3: Setup Next.js Frontend
echo -------------------------------
echo Run: cd ..\web
echo Run: npm install
echo Run: npm run dev
echo Test: http://127.0.0.1:3000/
echo.

echo Step 4: Test Multi-Tenancy
echo ----------------------------
echo Test: http://marysrestaurant.lvh.me:3000/
echo Test: http://127.0.0.1:3000/build (onboarding)
echo Test: http://127.0.0.1:3000/dashboard/admin
echo Test: http://127.0.0.1:3000/dashboard/user
echo.

echo Step 5: Test API Endpoints
echo ----------------------------
echo POST http://127.0.0.1:8000/api/onboarding/check-slug/
echo POST http://127.0.0.1:8000/api/onboarding/start/
echo GET  http://127.0.0.1:8000/api/admin/stats/
echo GET  http://127.0.0.1:8000/api/admin/tenants/
echo.

pause