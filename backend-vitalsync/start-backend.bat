@echo off
REM Backend Setup Script for Vital Sync
REM This script installs dependencies and starts the backend

cd /d "c:\Users\Best\Downloads\inflamm-ai-ai\backend-vitalsync"

echo.
echo ========================================
echo Vital Sync Backend Setup
echo ========================================
echo.

echo [1/3] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    exit /b 1
)

echo.
echo [2/3] Initializing database...
call npm run db:init
if %errorlevel% neq 0 (
    echo WARNING: Database initialization failed
    echo Continuing with mock database...
)

echo.
echo [3/3] Starting backend server...
call npm run dev

pause
