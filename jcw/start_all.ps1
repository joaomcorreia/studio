#!/usr/bin/env pwsh
# JCW Development Environment Starter (PowerShell)

Write-Host "====================================================" -ForegroundColor Blue
Write-Host "  JCW Development Environment Starter" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Kill existing processes
Write-Host "[STEP 1] Cleaning up existing processes..." -ForegroundColor Cyan
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✓ Cleaned up existing processes" -ForegroundColor Green
} catch {
    Write-Host "No existing processes to clean up" -ForegroundColor Gray
}

Start-Sleep -Seconds 2

# Step 2: Start Django API
Write-Host "[STEP 2] Starting Django API Server..." -ForegroundColor Cyan
$djangoPath = "C:\projects\studio\jcw\apps\api"
$venvPath = "C:\projects\studio\.venv\Scripts\Activate.ps1"

$djangoJob = Start-Job -ScriptBlock {
    param($path, $venv)
    Set-Location $path
    & $venv
    python manage.py runserver 127.0.0.1:8000
} -ArgumentList $djangoPath, $venvPath

Write-Host "✓ Django job started (ID: $($djangoJob.Id))" -ForegroundColor Green

# Step 3: Wait and start Next.js
Write-Host "[STEP 3] Starting Next.js Frontend..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

$nextjsPath = "C:\projects\studio\jcw\apps\web"
$nextjsJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev
} -ArgumentList $nextjsPath

Write-Host "✓ Next.js job started (ID: $($nextjsJob.Id))" -ForegroundColor Green

# Step 4: Wait for services to start
Write-Host "[STEP 4] Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Step 5: Test services
Write-Host "[STEP 5] Testing services..." -ForegroundColor Cyan
Write-Host ""

# Test Django API
try {
    $apiResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/" -TimeoutSec 5 -ErrorAction Stop
    if ($apiResponse.StatusCode -eq 200) {
        Write-Host "[✓] Django API is running successfully" -ForegroundColor Green
        $apiRunning = $true
    }
} catch {
    Write-Host "[✗] Django API failed to start: $($_.Exception.Message)" -ForegroundColor Red
    $apiRunning = $false
}

# Test Next.js Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "[✓] Next.js Frontend is running successfully" -ForegroundColor Green
        $frontendRunning = $true
    }
} catch {
    Write-Host "[✗] Next.js Frontend failed to start: $($_.Exception.Message)" -ForegroundColor Red
    $frontendRunning = $false
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Blue
Write-Host "  STATUS SUMMARY" -ForegroundColor Yellow  
Write-Host "====================================================" -ForegroundColor Blue
Write-Host "Django API:     http://127.0.0.1:8000/admin/"
Write-Host "Next.js Web:    http://localhost:3000/build"
Write-Host "Templates:      http://localhost:3000/dashboard/admin/templates"
Write-Host ""

if ($apiRunning -and $frontendRunning) {
    Write-Host "[🎉] ALL SERVICES RUNNING! Ready to develop!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick Links:" -ForegroundColor Yellow
    Write-Host "- Build Page: http://localhost:3000/build"
    Write-Host "- Admin Panel: http://127.0.0.1:8000/admin/ (admin/admin123)"
    Write-Host "- Templates: http://localhost:3000/dashboard/admin/templates"
    
    Write-Host ""
    Write-Host "Opening build page in browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:3000/build"
} else {
    Write-Host "[⚠️ ] Some services failed to start. Check the error messages above." -ForegroundColor Yellow
    
    if (!$apiRunning) {
        Write-Host ""
        Write-Host "Django troubleshooting:" -ForegroundColor Red
        Write-Host "- Check if virtual environment is activated"
        Write-Host "- Verify manage.py exists in apps/api directory"
        Write-Host "- Run manually: cd apps/api && python manage.py runserver"
    }
    
    if (!$frontendRunning) {
        Write-Host ""
        Write-Host "Next.js troubleshooting:" -ForegroundColor Red
        Write-Host "- Check if node_modules exist (run: npm install)"
        Write-Host "- Verify package.json exists in apps/web directory" 
        Write-Host "- Run manually: cd apps/web && npm run dev"
    }
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Blue
Write-Host "Jobs running in background:" -ForegroundColor Gray
Write-Host "- Django Job ID: $($djangoJob.Id)"
Write-Host "- Next.js Job ID: $($nextjsJob.Id)"
Write-Host ""
Write-Host "To stop all services, run: Get-Job | Stop-Job" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Blue

# Keep script running to maintain jobs
Write-Host "Press Ctrl+C to stop all services and exit..."
try {
    while ($true) {
        Start-Sleep -Seconds 5
        # Check if jobs are still running
        $runningJobs = Get-Job | Where-Object { $_.State -eq "Running" }
        if ($runningJobs.Count -eq 0) {
            Write-Host "All services have stopped. Exiting..." -ForegroundColor Yellow
            break
        }
    }
} catch {
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}