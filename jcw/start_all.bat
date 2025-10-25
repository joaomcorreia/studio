@echo off
cls
echo ====================================================
echo   JCW Development Environment Starter
echo ====================================================
echo.

echo [STEP 1] Killing any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [STEP 2] Starting Django API Server...
start "Django API (Port 8000)" /min cmd /c "cd /d C:\projects\studio\jcw\apps\api && C:\projects\studio\.venv\Scripts\activate && python manage.py runserver 127.0.0.1:8000"

echo [STEP 3] Waiting for Django to start...
timeout /t 5 /nobreak >nul

echo [STEP 4] Starting Next.js Frontend...
start "Next.js Frontend (Port 3000)" /min cmd /c "cd /d C:\projects\studio\jcw\apps\web && npm run dev"

echo [STEP 5] Waiting for Next.js to start...
timeout /t 8 /nobreak >nul

echo [STEP 6] Testing servers...
echo.

echo Testing Django API (http://127.0.0.1:8000)...
curl -s -o nul -w "%%{http_code}" http://127.0.0.1:8000/api/ >temp_status.txt 2>nul
set /p api_status=<temp_status.txt
del temp_status.txt >nul 2>&1

if "%api_status%"=="200" (
    echo [✓] Django API is running successfully
) else (
    echo [✗] Django API failed to start (Status: %api_status%)
)

echo Testing Next.js Frontend (http://localhost:3000)...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 >temp_status.txt 2>nul
set /p frontend_status=<temp_status.txt
del temp_status.txt >nul 2>&1

if "%frontend_status%"=="200" (
    echo [✓] Next.js Frontend is running successfully
) else (
    echo [✗] Next.js Frontend failed to start (Status: %frontend_status%)
)

echo.
echo ====================================================
echo   STATUS SUMMARY
echo ====================================================
echo Django API:     http://127.0.0.1:8000/admin/
echo Next.js Web:    http://localhost:3000/build
echo Templates:      http://localhost:3000/dashboard/admin/templates
echo.

if "%api_status%"=="200" if "%frontend_status%"=="200" (
    echo [🎉] ALL SERVICES RUNNING! Ready to develop!
    echo.
    echo Quick Links:
    echo - Build Page: http://localhost:3000/build
    echo - Admin Panel: http://127.0.0.1:8000/admin/ (admin/admin123)
    echo - Templates: http://localhost:3000/dashboard/admin/templates
) else (
    echo [⚠️ ] Some services failed to start. Check the error windows.
)

echo.
echo Press any key to open the build page in your browser...
pause >nul
start "" "http://localhost:3000/build"

echo.
echo ====================================================
echo Development servers are now running in background.
echo Close this window when you're done developing.
echo ====================================================
pause