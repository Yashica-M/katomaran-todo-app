#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========== Environment Variables Check Script ==========${NC}"
echo "This script will help you verify your environment variables are properly configured."

# Frontend checks
echo -e "\n${YELLOW}Checking Frontend Environment Variables:${NC}"

# Check if frontend .env exists
if [ -f "./client/.env" ]; then
  echo -e "${GREEN}✅ Frontend .env file exists${NC}"
  
  # Check specific frontend variables
  if grep -q "REACT_APP_API_URL" "./client/.env"; then
    api_url=$(grep "REACT_APP_API_URL" "./client/.env" | cut -d '=' -f2)
    echo -e "${GREEN}✅ REACT_APP_API_URL is set to:${NC} $api_url"
    
    # Check if it contains localhost
    if [[ $api_url == *"localhost"* ]]; then
      echo -e "${RED}⚠️ WARNING: REACT_APP_API_URL contains 'localhost' which won't work in production${NC}"
    fi
  else
    echo -e "${RED}❌ REACT_APP_API_URL is missing${NC}"
  fi
  
  if grep -q "REACT_APP_SOCKET_URL" "./client/.env"; then
    echo -e "${GREEN}✅ REACT_APP_SOCKET_URL is set${NC}"
  else
    echo -e "${RED}❌ REACT_APP_SOCKET_URL is missing${NC}"
  fi
else
  echo -e "${RED}❌ Frontend .env file is missing${NC}"
fi

# Backend checks
echo -e "\n${YELLOW}Checking Backend Environment Variables:${NC}"

# Check if backend .env exists
if [ -f "./server/.env" ]; then
  echo -e "${GREEN}✅ Backend .env file exists${NC}"
  
  # Check specific backend variables
  if grep -q "GOOGLE_CLIENT_ID" "./server/.env"; then
    echo -e "${GREEN}✅ GOOGLE_CLIENT_ID is set${NC}"
  else
    echo -e "${RED}❌ GOOGLE_CLIENT_ID is missing${NC}"
  fi
  
  if grep -q "GOOGLE_CLIENT_SECRET" "./server/.env"; then
    echo -e "${GREEN}✅ GOOGLE_CLIENT_SECRET is set${NC}"
  else
    echo -e "${RED}❌ GOOGLE_CLIENT_SECRET is missing${NC}"
  fi
  
  if grep -q "CLIENT_URL" "./server/.env"; then
    client_url=$(grep "CLIENT_URL" "./server/.env" | cut -d '=' -f2)
    echo -e "${GREEN}✅ CLIENT_URL is set to:${NC} $client_url"
    
    # Check if it contains localhost
    if [[ $client_url == *"localhost"* ]]; then
      echo -e "${RED}⚠️ WARNING: CLIENT_URL contains 'localhost' which won't work in production${NC}"
    fi
  else
    echo -e "${RED}❌ CLIENT_URL is missing${NC}"
  fi
  
  if grep -q "JWT_SECRET" "./server/.env"; then
    echo -e "${GREEN}✅ JWT_SECRET is set${NC}"
  else
    echo -e "${RED}❌ JWT_SECRET is missing${NC}"
  fi
  
  if grep -q "MONGO_URI" "./server/.env"; then
    echo -e "${GREEN}✅ MONGO_URI is set${NC}"
  else
    echo -e "${RED}❌ MONGO_URI is missing${NC}"
  fi
else
  echo -e "${RED}❌ Backend .env file is missing${NC}"
fi

echo -e "\n${YELLOW}Deployment Configuration Check:${NC}"

# Check render.yaml
if [ -f "./server/render.yaml" ]; then
  echo -e "${GREEN}✅ render.yaml file exists${NC}"
  
  # Check for environment variables in render.yaml
  if grep -q "GOOGLE_CLIENT_ID" "./server/render.yaml"; then
    echo -e "${GREEN}✅ GOOGLE_CLIENT_ID is in render.yaml${NC}"
  else
    echo -e "${RED}❌ GOOGLE_CLIENT_ID is missing from render.yaml${NC}"
  fi
  
  if grep -q "CLIENT_URL" "./server/render.yaml"; then
    echo -e "${GREEN}✅ CLIENT_URL is in render.yaml${NC}"
  else
    echo -e "${RED}❌ CLIENT_URL is missing from render.yaml${NC}"
  fi
else
  echo -e "${RED}❌ render.yaml file is missing${NC}"
fi

echo -e "\n${YELLOW}Troubleshooting Recommendations:${NC}"
echo -e "1. Make sure all environment variables are correctly set in both frontend and backend"
echo -e "2. Ensure no localhost URLs are used in production environments"
echo -e "3. Verify Google OAuth credentials are correctly set"
echo -e "4. Check that CLIENT_URL in backend points to your deployed frontend URL"
echo -e "5. Check that REACT_APP_API_URL in frontend points to your deployed backend API URL"
echo -e "6. Remember to rebuild and redeploy after changing environment variables"

echo -e "\n${YELLOW}========== End of Check ==========${NC}"
