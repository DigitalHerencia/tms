#!/usr/bin/env pwsh
# Quick test script to check for build errors

Write-Host "Checking for TypeScript compilation errors..."

# Change to project directory
Set-Location "d:\FleetFusion-MT_RBAC_TMS_SaaS\FleetFusion-Main"

# Run TypeScript check
npx tsc --noEmit --project tsconfig.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful - no errors found!" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript compilation failed - errors found" -ForegroundColor Red
    exit 1
}
