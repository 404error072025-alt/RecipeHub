@echo off
cd /d "%~dp0backend"
if not exist venv\Scripts\python.exe (
  python -m venv venv
  venv\Scripts\pip.exe install -r requirements.txt
)
venv\Scripts\python.exe manage.py migrate
venv\Scripts\python.exe manage.py runserver 8000
