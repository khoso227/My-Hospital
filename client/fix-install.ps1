# Hospital Management - Complete Fix Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hospital Management - Dependency Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to client directory
Set-Location $PSScriptRoot
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Green
$npmVersion = npm --version
Write-Host "npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Remove existing node_modules if exists
if (Test-Path node_modules) {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "Removed!" -ForegroundColor Green
    Write-Host ""
}

# Remove package-lock.json if exists
if (Test-Path package-lock.json) {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Write-Host "Removed!" -ForegroundColor Green
    Write-Host ""
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Green
npm cache clean --force
Write-Host "Cache cleared!" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
Write-Host "This may take 2-3 minutes. Please wait..." -ForegroundColor Yellow
Write-Host ""

npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Green
Write-Host ""

if (Test-Path node_modules\react) {
    Write-Host "SUCCESS: react installed" -ForegroundColor Green
} else {
    Write-Host "ERROR: react MISSING" -ForegroundColor Red
}

if (Test-Path node_modules\react-router-dom) {
    Write-Host "SUCCESS: react-router-dom installed" -ForegroundColor Green
} else {
    Write-Host "ERROR: react-router-dom MISSING" -ForegroundColor Red
}

if (Test-Path node_modules\axios) {
    Write-Host "SUCCESS: axios installed" -ForegroundColor Green
} else {
    Write-Host "ERROR: axios MISSING" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Done! Now run: npm run dev" -ForegroundColor Cyan
