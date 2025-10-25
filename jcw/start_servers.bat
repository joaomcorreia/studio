@echo off
echo Starting Django and Next.js servers...

start "Django Server" cmd /k "cd /d C:\projects\studio\jcw\apps\api && C:\projects\studio\.venv\Scripts\python.exe manage.py runserver 8000"

timeout /t 3

start "Next.js Server" cmd /k "cd /d C:\projects\studio\jcw\apps\web && npm run dev"

echo Both servers are starting in separate windows...
pause