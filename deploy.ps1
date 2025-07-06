# Deployment Scripts for Windows PowerShell

# Variables
$FRONTEND_DIR = "client"
$BACKEND_DIR = "server"
$BUILD_DIR = "$FRONTEND_DIR\build"

Write-Host "Todo Task Management App Deployment Script" -ForegroundColor Yellow
Write-Host "==============================================="

# Function to deploy frontend to Vercel
function Deploy-Frontend {
    Write-Host "Deploying frontend to Vercel..." -ForegroundColor Green
    Write-Host "1. Ensure you have Vercel CLI installed: npm install -g vercel"
    Write-Host "2. Navigate to the client directory: cd $FRONTEND_DIR"
    Write-Host "3. Run: vercel --prod"
    Write-Host "4. Follow the prompts to deploy"
    Write-Host ""
    Write-Host "Alternatively, connect your GitHub repository to Vercel for automatic deployments."
}

# Function to deploy backend to Render or Railway
function Deploy-Backend {
    Write-Host "Deploying backend to Render.com or Railway..." -ForegroundColor Green
    Write-Host "For Render.com:"
    Write-Host "1. Create a new Web Service"
    Write-Host "2. Connect your GitHub repository"
    Write-Host "3. Set the root directory to: $BACKEND_DIR"
    Write-Host "4. Build command: npm install"
    Write-Host "5. Start command: npm start"
    Write-Host "6. Add all environment variables from your .env file"
    Write-Host ""
    Write-Host "For Railway:"
    Write-Host "1. Create a new project"
    Write-Host "2. Connect your GitHub repository"
    Write-Host "3. Configure the service to use the server directory"
    Write-Host "4. Add all environment variables from your .env file"
    Write-Host "5. Deploy the service"
}

# Function to set up MongoDB Atlas
function Setup-MongoDB {
    Write-Host "Setting up MongoDB Atlas..." -ForegroundColor Green
    Write-Host "1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas"
    Write-Host "2. Create a new cluster (the free tier works fine for development)"
    Write-Host "3. Create a database user with read and write permissions"
    Write-Host "4. Whitelist your IP address or use 0.0.0.0/0 to allow access from anywhere"
    Write-Host "5. Get your connection string: Click 'Connect' > 'Connect your application'"
    Write-Host "6. Add the connection string to your server .env file as MONGO_URI"
}

# Function to update environment variables
function Update-EnvVars {
    Write-Host "Updating environment variables..." -ForegroundColor Green
    Write-Host "For the backend (.env in $BACKEND_DIR):"
    Write-Host "- MONGO_URI: Your MongoDB Atlas connection string"
    Write-Host "- JWT_SECRET: A secure random string for JWT tokens"
    Write-Host "- GOOGLE_CLIENT_ID: Your Google OAuth client ID"
    Write-Host "- GOOGLE_CLIENT_SECRET: Your Google OAuth client secret"
    Write-Host "- CLIENT_URL: Your frontend production URL (e.g., https://your-app.vercel.app)"
    Write-Host "- NODE_ENV: 'production'"
    Write-Host ""
    Write-Host "For the frontend (.env in $FRONTEND_DIR):"
    Write-Host "- REACT_APP_API_URL: Your backend API URL (e.g., https://your-api.onrender.com/api)"
    Write-Host "- REACT_APP_SOCKET_URL: Your backend URL (e.g., https://your-api.onrender.com)"
}

# Function to build frontend for production
function Build-Frontend {
    Write-Host "Building frontend for production..." -ForegroundColor Green
    Set-Location $FRONTEND_DIR
    Write-Host "Running npm install..."
    npm install
    Write-Host "Running npm run build..."
    npm run build
    Write-Host "Frontend build completed. Files are in $BUILD_DIR directory."
    Set-Location ..
}

# Function to test the build
function Test-Build {
    Write-Host "Testing production build..." -ForegroundColor Green
    Write-Host "Testing frontend:"
    Write-Host "1. cd $FRONTEND_DIR"
    Write-Host "2. npx serve -s build (you may need to install serve: npm install -g serve)"
    Write-Host "3. Open http://localhost:5000 in your browser"
    Write-Host ""
    Write-Host "Testing backend:"
    Write-Host "1. cd $BACKEND_DIR"
    Write-Host "2. $env:NODE_ENV='production'; npm start"
    Write-Host "3. Test API endpoints using Postman or curl"
}

# Main menu
Write-Host "Please select an option:"
Write-Host "1. Build frontend for production"
Write-Host "2. Set up MongoDB Atlas"
Write-Host "3. Update environment variables"
Write-Host "4. Deploy frontend to Vercel"
Write-Host "5. Deploy backend to Render/Railway"
Write-Host "6. Test production build"
Write-Host "7. Exit"

$choice = Read-Host "Enter your choice (1-7)"

switch ($choice) {
    1 { Build-Frontend }
    2 { Setup-MongoDB }
    3 { Update-EnvVars }
    4 { Deploy-Frontend }
    5 { Deploy-Backend }
    6 { Test-Build }
    7 { Write-Host "Exiting..."; exit }
    default { Write-Host "Invalid option. Exiting..."; exit }
}

Write-Host "Done!" -ForegroundColor Green
