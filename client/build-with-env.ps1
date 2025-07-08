# PowerShell script to build the React app with environment variables properly injected
# This ensures the environment variables are available at runtime

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building React app with environment variables properly injected" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create runtime-env.js to expose environment variables to the browser
Write-Host "Creating runtime-env.js file..." -ForegroundColor Yellow

$envContent = @"
window.ENV_NODE_ENV = "$env:NODE_ENV";
window.ENV_REACT_APP_API_URL = "$env:REACT_APP_API_URL";
window.ENV_REACT_APP_CLIENT_URL = "$env:REACT_APP_CLIENT_URL";
window.ENV_REACT_APP_SOCKET_URL = "$env:REACT_APP_SOCKET_URL";
console.log('Runtime environment variables loaded');
"@

Set-Content -Path "./public/runtime-env.js" -Value $envContent

# Ensure we have production URLs hardcoded as fallback
if (-not $env:REACT_APP_API_URL -or $env:REACT_APP_API_URL -eq "") {
    Write-Host "WARNING: REACT_APP_API_URL is not set! Using hardcoded production URL." -ForegroundColor Red
    $env:REACT_APP_API_URL = "https://katomaran-todo-app-tdqg.onrender.com/api"
}

# Show the environment variables being used for the build
Write-Host ""
Write-Host "Using environment variables:" -ForegroundColor Yellow
Write-Host "NODE_ENV: $env:NODE_ENV"
Write-Host "REACT_APP_API_URL: $env:REACT_APP_API_URL"
Write-Host "REACT_APP_CLIENT_URL: $env:REACT_APP_CLIENT_URL"
Write-Host "REACT_APP_SOCKET_URL: $env:REACT_APP_SOCKET_URL"

# Modify index.html to include the runtime-env.js script
Write-Host ""
Write-Host "Updating index.html to include runtime-env.js..." -ForegroundColor Yellow

$indexHtml = Get-Content -Path "./public/index.html" -Raw
$indexHtml = $indexHtml -replace '<head>', '<head>`n    <script src="%PUBLIC_URL%/runtime-env.js"></script>'
Set-Content -Path "./public/index.html" -Value $indexHtml

# Run the standard build command
Write-Host ""
Write-Host "Running npm build command..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "Build completed with runtime environment variables injected." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
