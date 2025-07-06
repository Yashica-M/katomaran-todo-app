# Kill process on port 5000 (Windows PowerShell script)
# This is useful when the port is already in use

# Check what process is using port 5000
Write-Host "Checking for processes using port 5000..." -ForegroundColor Yellow

$processInfo = netstat -ano | findstr :5000
Write-Host "Result:" -ForegroundColor Cyan
$processInfo

if ($processInfo) {
    # Extract PID from the result (last column)
    $processLines = $processInfo -split "`n"
    $pids = @()
    
    foreach ($line in $processLines) {
        if ($line -match ":5000\s+.*\s+(\d+)$") {
            $pid = $matches[1]
            if (-not ($pids -contains $pid)) {
                $pids += $pid
            }
        }
    }
    
    if ($pids.Count -gt 0) {
        Write-Host "`nFound the following process(es) using port 5000:" -ForegroundColor Green
        foreach ($pid in $pids) {
            $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
            Write-Host "PID: $pid - Process Name: $processName" -ForegroundColor Cyan
        }
        
        $confirmation = Read-Host "`nDo you want to kill these processes? (y/n)"
        if ($confirmation -eq 'y') {
            foreach ($pid in $pids) {
                try {
                    Stop-Process -Id $pid -Force
                    Write-Host "Process with PID $pid has been terminated." -ForegroundColor Green
                }
                catch {
                    Write-Host "Failed to terminate process with PID $pid. Try running as administrator." -ForegroundColor Red
                }
            }
        } else {
            Write-Host "No processes were terminated." -ForegroundColor Yellow
        }
    } else {
        Write-Host "No processes found using port 5000." -ForegroundColor Yellow
    }
} else {
    Write-Host "No processes found using port 5000." -ForegroundColor Yellow
}

Write-Host "`nAlternatively, you can change the default port in server/index.js or set a different PORT in your .env file." -ForegroundColor Cyan
