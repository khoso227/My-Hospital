@echo off
echo Installing dependencies...
cd /d "%~dp0"
call npm install
if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Packages installed!
    echo.
    echo Now run: npm run dev
) else (
    echo.
    echo ERROR: Installation failed!
    echo Please run PowerShell as Administrator and try again.
)
pause
