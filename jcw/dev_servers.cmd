@echo off
echo =====================================
echo  Starting JCW Development Servers
echo =====================================
echo.

echo Starting Django API server...
start "Django API" cmd /k "cd /d c:\projects\studio\jcw\apps\api && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting Next.js frontend server...
start "Next.js Frontend" cmd /k "cd /d c:\projects\studio\jcw\apps\web && npm run dev"

echo.
echo ✅ Development servers starting...
echo.
echo Django API:     http://127.0.0.1:8000/
echo Next.js Web:    http://127.0.0.1:3000/
echo Admin Panel:    http://127.0.0.1:8000/admin/
echo.
echo Demo site:      http://marysrestaurant.lvh.me:3000/
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /F /FI "WindowTitle eq Django API*" > nul 2>&1
taskkill /F /FI "WindowTitle eq Next.js Frontend*" > nul 2>&1
echo Servers stopped.