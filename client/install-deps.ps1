# Hospital Management - Dependency Installation Script
# Run this script as Administrator if you get permission errors

Write-Host "Installing dependencies..." -ForegroundColor Green

# Navigate to client directory
Set-Location $PSScriptRoot

# Remove existing node_modules if exists
if (Test-Path node_modules) {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

# Install dependencies
Write-Host "Running npm install..." -ForegroundColor Green
npm install

# Verify critical packages
Write-Host "`nVerifying packages..." -ForegroundColor Green
$packages = @("axios", "react-router-dom", "react-toastify", "react", "react-dom")

foreach ($pkg in $packages) {
    if (Test-Path "node_modules\$pkg") {
        Write-Host "✓ $pkg installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $pkg MISSING" -ForegroundColor Red
    }
}

Write-Host "`nDone! Now run: npm run dev" -ForegroundColor Cyan
