# Deployment Scripts

# Variables
FRONTEND_DIR="client"
BACKEND_DIR="server"
BUILD_DIR="$FRONTEND_DIR/build"

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${YELLOW}Todo Task Management App Deployment Script${NC}"
echo "==============================================="

# Function to deploy frontend to Vercel
deploy_frontend() {
  echo "${GREEN}Deploying frontend to Vercel...${NC}"
  echo "1. Ensure you have Vercel CLI installed: npm install -g vercel"
  echo "2. Navigate to the client directory: cd $FRONTEND_DIR"
  echo "3. Run: vercel --prod"
  echo "4. Follow the prompts to deploy"
  echo ""
  echo "Alternatively, connect your GitHub repository to Vercel for automatic deployments."
}

# Function to deploy backend to Render or Railway
deploy_backend() {
  echo "${GREEN}Deploying backend to Render.com or Railway...${NC}"
  echo "For Render.com:"
  echo "1. Create a new Web Service"
  echo "2. Connect your GitHub repository"
  echo "3. Set the root directory to: $BACKEND_DIR"
  echo "4. Build command: npm install"
  echo "5. Start command: npm start"
  echo "6. Add all environment variables from your .env file"
  echo ""
  echo "For Railway:"
  echo "1. Create a new project"
  echo "2. Connect your GitHub repository"
  echo "3. Configure the service to use the server directory"
  echo "4. Add all environment variables from your .env file"
  echo "5. Deploy the service"
}

# Function to set up MongoDB Atlas
setup_mongodb() {
  echo "${GREEN}Setting up MongoDB Atlas...${NC}"
  echo "1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas"
  echo "2. Create a new cluster (the free tier works fine for development)"
  echo "3. Create a database user with read and write permissions"
  echo "4. Whitelist your IP address or use 0.0.0.0/0 to allow access from anywhere"
  echo "5. Get your connection string: Click 'Connect' > 'Connect your application'"
  echo "6. Add the connection string to your server .env file as MONGO_URI"
}

# Function to update environment variables
update_env_vars() {
  echo "${GREEN}Updating environment variables...${NC}"
  echo "For the backend (.env in $BACKEND_DIR):"
  echo "- MONGO_URI: Your MongoDB Atlas connection string"
  echo "- JWT_SECRET: A secure random string for JWT tokens"
  echo "- GOOGLE_CLIENT_ID: Your Google OAuth client ID"
  echo "- GOOGLE_CLIENT_SECRET: Your Google OAuth client secret"
  echo "- CLIENT_URL: Your frontend production URL (e.g., https://your-app.vercel.app)"
  echo "- NODE_ENV: 'production'"
  echo ""
  echo "For the frontend (.env in $FRONTEND_DIR):"
  echo "- REACT_APP_API_URL: Your backend API URL (e.g., https://your-api.onrender.com/api)"
  echo "- REACT_APP_SOCKET_URL: Your backend URL (e.g., https://your-api.onrender.com)"
}

# Function to build frontend for production
build_frontend() {
  echo "${GREEN}Building frontend for production...${NC}"
  cd $FRONTEND_DIR
  echo "Running npm install..."
  npm install
  echo "Running npm run build..."
  npm run build
  echo "Frontend build completed. Files are in $BUILD_DIR directory."
  cd ..
}

# Function to test the build
test_build() {
  echo "${GREEN}Testing production build...${NC}"
  echo "Testing frontend:"
  echo "1. cd $FRONTEND_DIR"
  echo "2. npm run serve (you may need to install serve: npm install -g serve)"
  echo "3. Open http://localhost:5000 in your browser"
  echo ""
  echo "Testing backend:"
  echo "1. cd $BACKEND_DIR"
  echo "2. NODE_ENV=production npm start"
  echo "3. Test API endpoints using Postman or curl"
}

# Main menu
echo "Please select an option:"
echo "1. Build frontend for production"
echo "2. Set up MongoDB Atlas"
echo "3. Update environment variables"
echo "4. Deploy frontend to Vercel"
echo "5. Deploy backend to Render/Railway"
echo "6. Test production build"
echo "7. Exit"

read -p "Enter your choice (1-7): " choice

case $choice in
  1) build_frontend ;;
  2) setup_mongodb ;;
  3) update_env_vars ;;
  4) deploy_frontend ;;
  5) deploy_backend ;;
  6) test_build ;;
  7) echo "Exiting..."; exit 0 ;;
  *) echo "Invalid option. Exiting..."; exit 1 ;;
esac

echo "${GREEN}Done!${NC}"
