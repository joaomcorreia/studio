@echo off
cls
echo ===============================================
echo   JCW Quick Starter - One Click Solution
echo ===============================================
echo.

echo [1/4] Cleaning up any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/4] Starting Django API...
start "Django-API" cmd /c "cd /d C:\projects\studio\jcw\apps\api && C:\projects\studio\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul

echo [3/4] Starting Next.js Frontend...
start "NextJS-Web" cmd /c "cd /d C:\projects\studio\jcw\apps\web && npm run dev"
timeout /t 5 /nobreak >nul

echo [4/4] Testing services...
echo.

powershell -Command "try { $api = Invoke-WebRequest 'http://127.0.0.1:8000/api/' -UseBasicParsing -TimeoutSec 3; if($api.StatusCode -eq 200) { Write-Host '[✓] Django API running at http://127.0.0.1:8000/admin/' -ForegroundColor Green } } catch { Write-Host '[✗] Django API not responding' -ForegroundColor Red }"

powershell -Command "try { $web = Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing -TimeoutSec 3; if($web.StatusCode -eq 200) { Write-Host '[✓] Next.js Web running at http://localhost:3000/build' -ForegroundColor Green } } catch { Write-Host '[✗] Next.js not responding yet (still starting up)' -ForegroundColor Yellow }"

echo.
echo ===============================================
echo   🚀 DEVELOPMENT ENVIRONMENT READY!
echo ===============================================
echo.
echo   Quick Links:
echo   • Website Builder: http://localhost:3000/build
echo   • Admin Panel: http://127.0.0.1:8000/admin/
echo   • Templates: http://localhost:3000/dashboard/admin/templates
echo.
echo   Credentials: admin / admin123
echo.

echo Opening website builder in your browser...
start http://localhost:3000/build

echo.
echo Press any key to exit (servers will keep running)...
pause >nul