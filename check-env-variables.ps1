Write-Host "========== Environment Variables Check Script ==========" -ForegroundColor Yellow
Write-Host "This script will help you verify your environment variables are properly configured."

# Frontend checks
Write-Host "`nChecking Frontend Environment Variables:" -ForegroundColor Yellow

# Check if frontend .env exists
if (Test-Path -Path "./client/.env") {
    Write-Host "✅ Frontend .env file exists" -ForegroundColor Green
    
    # Check specific frontend variables
    $envContent = Get-Content -Path "./client/.env" -Raw
    if ($envContent -match "REACT_APP_API_URL=(.*)") {
        $apiUrl = $matches[1]
        Write-Host "✅ REACT_APP_API_URL is set to: $apiUrl" -ForegroundColor Green
        
        # Check if it contains localhost
        if ($apiUrl -match "localhost") {
            Write-Host "⚠️ WARNING: REACT_APP_API_URL contains 'localhost' which won't work in production" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ REACT_APP_API_URL is missing" -ForegroundColor Red
    }
    
    if ($envContent -match "REACT_APP_SOCKET_URL") {
        Write-Host "✅ REACT_APP_SOCKET_URL is set" -ForegroundColor Green
    } else {
        Write-Host "❌ REACT_APP_SOCKET_URL is missing" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend .env file is missing" -ForegroundColor Red
}

# Backend checks
Write-Host "`nChecking Backend Environment Variables:" -ForegroundColor Yellow

# Check if backend .env exists
if (Test-Path -Path "./server/.env") {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
    
    # Check specific backend variables
    $envContent = Get-Content -Path "./server/.env" -Raw
    
    if ($envContent -match "GOOGLE_CLIENT_ID") {
        Write-Host "✅ GOOGLE_CLIENT_ID is set" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_ID is missing" -ForegroundColor Red
    }
    
    if ($envContent -match "GOOGLE_CLIENT_SECRET") {
        Write-Host "✅ GOOGLE_CLIENT_SECRET is set" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_SECRET is missing" -ForegroundColor Red
    }
    
    if ($envContent -match "CLIENT_URL=(.*)") {
        $clientUrl = $matches[1]
        Write-Host "✅ CLIENT_URL is set to: $clientUrl" -ForegroundColor Green
        
        # Check if it contains localhost
        if ($clientUrl -match "localhost") {
            Write-Host "⚠️ WARNING: CLIENT_URL contains 'localhost' which won't work in production" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ CLIENT_URL is missing" -ForegroundColor Red
    }
    
    if ($envContent -match "JWT_SECRET") {
        Write-Host "✅ JWT_SECRET is set" -ForegroundColor Green
    } else {
        Write-Host "❌ JWT_SECRET is missing" -ForegroundColor Red
    }
    
    if ($envContent -match "MONGO_URI") {
        Write-Host "✅ MONGO_URI is set" -ForegroundColor Green
    } else {
        Write-Host "❌ MONGO_URI is missing" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Backend .env file is missing" -ForegroundColor Red
}

Write-Host "`nDeployment Configuration Check:" -ForegroundColor Yellow

# Check render.yaml
if (Test-Path -Path "./server/render.yaml") {
    Write-Host "✅ render.yaml file exists" -ForegroundColor Green
    
    # Check for environment variables in render.yaml
    $renderYaml = Get-Content -Path "./server/render.yaml" -Raw
    
    if ($renderYaml -match "GOOGLE_CLIENT_ID") {
        Write-Host "✅ GOOGLE_CLIENT_ID is in render.yaml" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_ID is missing from render.yaml" -ForegroundColor Red
    }
    
    if ($renderYaml -match "CLIENT_URL") {
        Write-Host "✅ CLIENT_URL is in render.yaml" -ForegroundColor Green
    } else {
        Write-Host "❌ CLIENT_URL is missing from render.yaml" -ForegroundColor Red
    }
} else {
    Write-Host "❌ render.yaml file is missing" -ForegroundColor Red
}

Write-Host "`nTroubleshooting Recommendations:" -ForegroundColor Yellow
Write-Host "1. Make sure all environment variables are correctly set in both frontend and backend"
Write-Host "2. Ensure no localhost URLs are used in production environments"
Write-Host "3. Verify Google OAuth credentials are correctly set"
Write-Host "4. Check that CLIENT_URL in backend points to your deployed frontend URL"
Write-Host "5. Check that REACT_APP_API_URL in frontend points to your deployed backend API URL"
Write-Host "6. Remember to rebuild and redeploy after changing environment variables"

Write-Host "`n========== End of Check ==========" -ForegroundColor Yellow
