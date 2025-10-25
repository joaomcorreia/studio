@echo off
echo Initializing database for JCW API...
cd /d "%~dp0..\apps\api"

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Creating migrations...
python manage.py makemigrations

echo Running migrations for shared schema...
python manage.py migrate_schemas --shared

echo Running migrations for all tenant schemas...
python manage.py migrate_schemas

echo Creating demo data...
python manage.py seed_demo

echo Database initialization complete!
echo ✓ Public and tenant schemas created
echo ✓ Demo tenant 'marysrestaurant' created  
echo ✓ Sample sections and templates added
echo ✓ Admin user created: admin/admin123
echo.
echo You can now run: scripts\dev.cmd
pause