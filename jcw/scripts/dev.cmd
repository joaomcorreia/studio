@echo off
echo Starting JCW Development Environment...

echo Starting Django API server...
start "Django API" cmd /k "cd /d %~dp0..\apps\api && .venv\Scripts\activate.bat && python manage.py runserver 127.0.0.1:8000"

timeout /t 3

echo Starting Next.js Web server...
start "Next.js Web" cmd /k "cd /d %~dp0..\apps\web && npm run dev"

echo.
echo Development servers starting:
echo - Django API: http://127.0.0.1:8000
echo - Next.js Web: http://localhost:3000
echo.
echo For local subdomain testing, use:
echo - Main site: http://localhost:3000
echo - Test tenant: http://marysrestaurant.lvh.me:3000
echo.
echo Press Ctrl+C in each terminal window to stop servers.
pause