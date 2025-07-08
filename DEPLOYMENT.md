# ToDo App Deployment Guide

This document explains how to properly deploy the ToDo application to Vercel (frontend) and Render (backend).

## Backend Deployment (Render)

1. **Sign up for a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**
   - Connect to your GitHub repository
   - Set the following configuration:
     * Name: `katomaran-todo-app-backend`
     * Environment: Node.js
     * Build Command: `npm install`
     * Start Command: `npm start`
     * Root Directory: `/server`

3. **Set environment variables**
   - PORT: `10000`
   - MONGO_URI: `mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/todoapp`
   - JWT_SECRET: a secure random string
   - SESSION_SECRET: a secure random string
   - CLIENT_URL: `https://your-frontend-url.vercel.app` (no trailing slash)
   - GOOGLE_CLIENT_ID: from Google Developer Console
   - GOOGLE_CLIENT_SECRET: from Google Developer Console
   - NODE_ENV: `development` (until path-to-regexp error is fixed)

## Frontend Deployment (Vercel)

1. **Sign up for a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**
   - Set the following configuration:
     * Framework: Create React App
     * Root Directory: `/client`
     * Build Command: `npm run build` (default)
     * Output Directory: `build` (default)

3. **Set environment variables**
   - REACT_APP_API_URL: `https://your-backend-url.onrender.com/api`
   - REACT_APP_SOCKET_URL: `https://your-backend-url.onrender.com`

## Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**

2. **Create a new project or select an existing one**

3. **Configure OAuth consent screen**
   - Set User Type to "External"
   - Add required app information

4. **Create OAuth credentials**
   - Create OAuth Client ID
   - Application type: Web application
   - Add authorized JavaScript origins:
     * `https://your-frontend-url.vercel.app`
   - Add authorized redirect URIs:
     * `https://your-backend-url.onrender.com/api/auth/google/callback`

5. **Copy Client ID and Client Secret**
   - Add these values to your Render environment variables

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster**
   - Choose your preferred cloud provider and region
   - Select a cluster tier (M0 Free Tier is fine for small projects)
   - Click "Create Cluster"

3. **Set up database access**
   - Go to "Database Access" and create a new database user
   - Use a strong password and note it down
   - Select appropriate permissions (e.g., "Atlas admin" or "Read and write to any database")

4. **Configure network access**
   - Go to "Network Access" and click "Add IP Address"
   - For development: Add your current IP address or use "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add Render's IP addresses (refer to Render documentation)

5. **Get your connection string**
   - Go to "Databases" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with your preferred database name (e.g., `todoapp`)

6. **Add the connection string to your environment variables**
   - For local development: Add to `.env` file as `MONGO_URI`
   - For production: Add to Render environment variables as `MONGO_URI`

## Local Development Setup

1. **Set up your environment variables**
   - Create `.env` file in the `/server` directory with:
     ```
     PORT=10000
     MONGO_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/todoapp
     JWT_SECRET=your_jwt_secret_key
     SESSION_SECRET=your_session_secret_key
     CLIENT_URL=http://localhost:3000
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     NODE_ENV=development
     ```
   - Create `.env` file in the `/client` directory with:
     ```
     REACT_APP_API_URL=http://localhost:10000/api
     REACT_APP_SOCKET_URL=http://localhost:10000
     ```

2. **Install dependencies**
   ```
   cd server && npm install
   cd ../client && npm install
   ```

3. **Start the server**
   ```
   cd server && npm start
   ```

4. **Start the client**
   ```
   cd client && npm start
   ```

## Troubleshooting

### CORS Issues
- Ensure CLIENT_URL in backend exactly matches your frontend URL
- No trailing slashes
- No paths like "/login"

### Authentication Issues
- Verify Google OAuth redirect URIs are correctly set
- Check your JWT_SECRET and SESSION_SECRET are properly set

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check that your IP is allowed in MongoDB Atlas Network Access settings:
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
  2. Select your project/cluster
  3. Click on "Network Access" in the left sidebar
  4. Click "Add IP Address"
  5. Add your current IP or use "Allow Access from Anywhere" (0.0.0.0/0) for development
  6. For production, make sure Render's IPs are whitelisted

### Path-to-RegExp Error
If you encounter this error in production mode, set NODE_ENV to development until you can fix the code.

## Troubleshooting Google OAuth Authentication Issues

If you're experiencing issues with Google authentication in production, follow these troubleshooting steps:

### 1. Verify Environment Variables

Run the provided environment variable check script:

```bash
# For Linux/Mac users:
bash check-env-variables.sh

# For Windows users:
powershell -ExecutionPolicy Bypass -File check-env-variables.ps1
```

### 2. Check Google OAuth Configuration

1. **Verify Google OAuth credentials**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to "Credentials" > "OAuth 2.0 Client IDs"
   - Verify that your client ID and secret match those in your environment variables

2. **Check Authorized Redirect URIs**:
   - In Google Cloud Console, edit your OAuth client
   - Ensure these redirect URIs are added:
     * `https://your-backend-url.onrender.com/api/auth/google/callback`
     * `http://localhost:5000/api/auth/google/callback` (for local development)

3. **Verify Authorized JavaScript Origins**:
   - Add your frontend URL: `https://your-frontend-url.vercel.app`
   - Add your local development URL: `http://localhost:3000`

### 3. Clear Cache and Cookies

Authentication issues can sometimes be caused by cached data:
- Clear your browser cache and cookies
- Try using incognito/private mode
- Test in multiple browsers

### 4. Check Backend Logs

1. In Render dashboard, go to your backend service
2. Click on "Logs" to view real-time logs
3. Look for any errors related to Google authentication
4. Pay special attention to:
   - Environment variable loading issues
   - OAuth callback URL mismatches
   - Missing or invalid client ID/secret

### 5. Check Frontend Console

1. Open your deployed app
2. Open browser developer tools (F12)
3. Check the Console tab for any errors during login
4. Verify that `REACT_APP_API_URL` is correctly loaded and not undefined

### 6. Common Issues and Solutions

1. **"Invalid redirect_uri" error**:
   - Ensure the callback URI in your code exactly matches what's configured in Google Cloud Console
   - Check for trailing slashes or protocol mismatches (http vs https)

2. **"Error: redirect_uri_mismatch"**:
   - The redirect URI in the request doesn't match any of the authorized URIs
   - Add the exact callback URL including path to Google Cloud Console

3. **"Request failed with status code 404" for Google auth**:
   - Verify that your backend is properly deployed and running
   - Check that the API endpoint path is correct in both frontend and backend

4. **Authentication works locally but not in production**:
   - Verify all environment variables in production match your local working setup
   - Check that production URLs are used in production environments
   - Ensure no localhost URLs are present in production

5. **"Origin not allowed" errors**:
   - Add your frontend domain to CORS allowed origins in your backend

### 7. Rebuild and Redeploy

After making any changes to fix authentication:
1. Push changes to your GitHub repository
2. Trigger a new deployment in Vercel for frontend
3. Trigger a new deployment in Render for backend
4. Clear browser cache before testing again

Remember that environment variable changes require a rebuild and redeployment to take effect.

## Pre-Deployment Cleanup

Before deploying your application, make sure to remove any unnecessary files and dependencies:

### Files to Remove

1. **Debug/Development Files**
   - `server/debug-env.js`
   - `server/free-port.sh` and `server/free-port.ps1` (if not needed in production)

2. **Temporary/Testing Files**
   - Any test data or temporary files

### Update Environment Files
- Make sure `.env.example` files are up to date in both client and server
- Double-check that all environment variables are documented

### Check Git Ignore
- Ensure that `.gitignore` excludes:
  - `.env` files
  - `node_modules/`
  - Build directories (`/build`, `/dist`)
  - Log files
  - Any other sensitive information

## Production Readiness Checklist

Before finalizing your deployment, ensure you have:

1. **Environment Variables**
   - All necessary environment variables are set in Vercel and Render
   - No hardcoded URLs or secrets in the code
   - Environment examples are documented

2. **Security**
   - CORS is properly configured
   - Authentication is working correctly
   - Secrets are properly managed and not committed to Git

3. **Performance**
   - Static assets are optimized
   - Build processes are working correctly
   - No unnecessary packages or files included

4. **Monitoring & Maintenance**
   - Error logging is configured
   - Health checks are implemented
   - Database backups are configured

5. **Database**
   - MongoDB Atlas IP whitelist is correctly configured
   - Database user has appropriate permissions
   - Connection string is correctly formatted and working

After deployment, test the application thoroughly, especially the authentication flow and real-time features.
