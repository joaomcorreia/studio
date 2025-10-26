@echo off
cd /d "C:\projects\studio\jcw\apps\api"
call "C:\projects\studio\.venv\Scripts\Activate.bat"
python manage.py runserver 127.0.0.1:8000