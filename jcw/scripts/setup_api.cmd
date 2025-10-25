@echo off
echo Setting up Django API...
cd /d "%~dp0..\apps\api"

echo Creating virtual environment...
python -m venv .venv

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing Django and dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo Creating .env file from example...
if not exist ".env" (
    copy .env.example .env
    echo ✓ Created .env file - please update DATABASE_URL and SECRET_KEY
) else (
    echo ℹ .env file already exists
)

echo Django API setup complete!
echo Next steps:
echo 1. Update .env file with your settings
echo 2. Run: scripts\init_db.cmd
echo 3. Start dev server: scripts\dev.cmd
pause