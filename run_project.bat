@echo off
title NANDANKANAN Wildlife Platform Runner
echo ===================================================
echo   NANDANKANAN - The Living World of Wildlife
echo   Starting Backend (Django) and Frontend (Vite)...
echo ===================================================

set "PYTHON_EXE=python"
if exist "%~dp0backend\envv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0backend\envv\Scripts\python.exe"
)
if exist "%~dp0backend\venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0backend\venv\Scripts\python.exe"
)

:: Start Django Backend on Port 8000
start "Nandankanan Backend (Django API)" cmd /k "cd /d %~dp0backend && "%PYTHON_EXE%" manage.py runserver 127.0.0.1:8000"

:: Start React Frontend on Port 5173
start "Nandankanan Frontend (React Vite)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo Both servers have been launched!
echo - Web Portal: http://localhost:5173/
echo - Django API: http://127.0.0.1:8000/api/
echo - Django Admin: http://127.0.0.1:8000/admin/
echo.
pause
