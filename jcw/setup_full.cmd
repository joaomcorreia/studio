@echo off
echo =====================================
echo  Just Code Works v0 - Full Setup
echo =====================================
echo.

echo [1/5] Setting up Django API...
cd /d "c:\projects\studio\jcw"
call setup_api.cmd
if errorlevel 1 (
    echo ❌ Django setup failed
    pause
    exit /b 1
)
echo.

echo [2/5] Initializing database...
call init_db.cmd
if errorlevel 1 (
    echo ❌ Database initialization failed
    pause
    exit /b 1
)
echo.

echo [3/5] Seeding demo data...
cd apps\api
python manage.py seed_demo
cd ..\..
echo.

echo [4/5] Setting up Next.js frontend...
cd apps\web
if not exist node_modules (
    echo Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Node.js dependency installation failed
        pause
        exit /b 1
    )
)
echo.

echo [5/5] Running tests...
cd ..\..\
python test_implementation.py
echo.

echo =====================================
echo  🎉 Setup Complete!
echo =====================================
echo.
echo Your JCW platform is ready:
echo.
echo 📋 Django API:     http://127.0.0.1:8000/api/
echo 🌐 Next.js Web:    http://127.0.0.1:3000/
echo 🏢 Admin Panel:    http://127.0.0.1:8000/admin/
echo.
echo Demo tenant created:
echo 🍽️  Mary's Restaurant: http://marysrestaurant.lvh.me:3000/
echo 👤 Admin login: admin@jcw.com / admin123
echo.
echo To start the servers:
echo   1. Django API:  cd apps\api ^&^& python manage.py runserver
echo   2. Next.js Web: cd apps\web ^&^& npm run dev
echo.
pause