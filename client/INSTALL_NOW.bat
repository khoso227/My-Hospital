@echo off
echo ========================================
echo Hospital Management - Installing Packages
echo ========================================
echo.

cd /d "%~dp0"
echo Current Directory: %CD%
echo.

echo Step 1: Clearing npm cache...
call npm cache clean --force
echo.

echo Step 2: Installing packages...
echo This will take 2-3 minutes. Please wait...
echo.

call npm install

echo.
echo ========================================
echo Checking installation...
echo ========================================
echo.

if exist "node_modules\react" (
    echo [OK] react installed
) else (
    echo [ERROR] react MISSING
)

if exist "node_modules\react-router-dom" (
    echo [OK] react-router-dom installed
) else (
    echo [ERROR] react-router-dom MISSING
)

if exist "node_modules\axios" (
    echo [OK] axios installed
) else (
    echo [ERROR] axios MISSING
)

if exist "node_modules\react-toastify" (
    echo [OK] react-toastify installed
) else (
    echo [ERROR] react-toastify MISSING
)

if exist "node_modules\vite" (
    echo [OK] vite installed
) else (
    echo [ERROR] vite MISSING
)

echo.
echo ========================================
if exist "node_modules\react" (
    echo SUCCESS! Packages installed!
    echo.
    echo Now run: npm run dev
) else (
    echo ERROR! Installation failed!
    echo.
    echo Please:
    echo 1. Open PowerShell as Administrator
    echo 2. Run: cd E:\hospital_management\client
    echo 3. Run: npm install
)
echo ========================================
echo.
pause
