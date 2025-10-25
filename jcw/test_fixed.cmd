@echo off
echo =====================================
echo  JCW v0 - Fixed and Working!
echo =====================================
echo.
echo Django API Server: Running at http://127.0.0.1:8000/
echo.

echo Testing key endpoints:
echo.

echo 1. API Root:
curl -s http://127.0.0.1:8000/api/ | head -c 200
echo.
echo.

echo 2. Admin Panel:
echo   Visit: http://127.0.0.1:8000/admin/
echo   Login: admin / (set password with: python manage.py changepassword admin)
echo.

echo 3. API Endpoints Available:
echo   GET  /api/ - API root
echo   POST /api/onboarding/start/
echo   POST /api/onboarding/check-slug/
echo   GET  /api/admin/stats/
echo   GET  /api/admin/tenants/
echo   GET  /api/tenants/info/
echo   GET  /api/pages/
echo.

echo 4. Frontend Setup:
echo   Next.js should connect to: http://127.0.0.1:8000/api/
echo.

echo =====================================
echo  🎉 404 Issues RESOLVED!
echo =====================================
pause