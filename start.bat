@echo off
title TravelVista - Project Launcher
color 0A

echo.
echo ============================================
echo    TravelVista - Setup ^& Launcher
echo ============================================
echo.

:: ── Store project root ──────────────────────────────────────────
set "PROJECT_ROOT=%~dp0"
set "BACKEND_DIR=%PROJECT_ROOT%backend"
set "VENV_DIR=%BACKEND_DIR%\venv"

:: ════════════════════════════════════════════════════════════════
::  PYTHON CHECK / INSTALL
:: ════════════════════════════════════════════════════════════════
echo [1/3] Checking for Python...

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo       Python not found! Attempting to install...
    echo.

    where winget >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] winget is not available on this system.
        echo         Please install Python manually from https://www.python.org/downloads/
        echo         Make sure to check "Add Python to PATH" during installation.
        pause
        exit /b 1
    )

    echo       Installing Python via winget...
    winget install Python.Python.3.12 --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo [ERROR] Failed to install Python via winget.
        echo         Please install Python manually from https://www.python.org/downloads/
        pause
        exit /b 1
    )

    echo       Refreshing PATH...
    set "PATH=%LocalAppData%\Programs\Python\Python312;%LocalAppData%\Programs\Python\Python312\Scripts;%PATH%"

    where python >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARNING] Python was installed but not detected in PATH.
        echo           Please close this window and reopen it, then run start.bat again.
        pause
        exit /b 1
    )

    echo       Python installed successfully!
) else (
    for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo       Found: %%v
)

echo.

:: ════════════════════════════════════════════════════════════════
::  BACKEND SETUP (Python venv + dependencies)
:: ════════════════════════════════════════════════════════════════
echo [2/3] Setting up Python environment...

if not exist "%VENV_DIR%" (
    echo       Creating virtual environment...
    python -m venv "%VENV_DIR%"
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo       Virtual environment created.
) else (
    echo       Virtual environment already exists. Skipping.
)

echo       Installing Python dependencies...
call "%VENV_DIR%\Scripts\activate.bat"
pip install -r "%BACKEND_DIR%\requirements.txt" --quiet
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b 1
)
echo       Python dependencies installed.

echo.

:: ════════════════════════════════════════════════════════════════
::  LAUNCH SERVER
:: ════════════════════════════════════════════════════════════════
echo [3/3] Starting TravelVista server...
echo.
echo ============================================
echo    TravelVista running at:
echo    http://127.0.0.1:5000
echo ============================================
echo.
echo    The backend serves both the API and
echo    the frontend (no Node.js needed!)
echo.
echo    Press Ctrl+C to stop the server.
echo.

cd /d "%BACKEND_DIR%"
call "%VENV_DIR%\Scripts\activate.bat"
python app.py

pause
