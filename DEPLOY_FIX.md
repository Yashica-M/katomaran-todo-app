# Deploy Instructions

Based on the error we've seen ("ERR_CONNECTION_REFUSED" when trying to access localhost:5000/api/auth/google), the issue appears to be:

1. Environment variables are not being properly injected into the production build
2. The React app is defaulting to localhost URLs instead of production URLs

## How to Fix & Deploy

### Step 1: Use the Hardcoded URLs Fix
We've already updated the Login.js file to use hardcoded production URLs instead of relying on environment variables. This should resolve the immediate issue.

### Step 2: Build with Runtime Environment Variables

Run the following command in your client folder to build with runtime environment variables:

```powershell
# For Windows:
$env:REACT_APP_API_URL = "https://katomaran-todo-app-tdqg.onrender.com/api"
$env:REACT_APP_CLIENT_URL = "https://katomaran-todo-app-cyy5.vercel.app"
$env:REACT_APP_SOCKET_URL = "https://katomaran-todo-app-tdqg.onrender.com"
$env:NODE_ENV = "production"
.\build-with-env.ps1
```

OR

```bash
# For bash/linux:
export REACT_APP_API_URL="https://katomaran-todo-app-tdqg.onrender.com/api"
export REACT_APP_CLIENT_URL="https://katomaran-todo-app-cyy5.vercel.app"
export REACT_APP_SOCKET_URL="https://katomaran-todo-app-tdqg.onrender.com"
export NODE_ENV="production"
bash ./build-with-env.sh
```

### Step 3: Deploy to Vercel

1. Make sure all changes are committed:
```
git add .
git commit -m "Fix Google OAuth with hardcoded URLs and runtime environment variables"
git push
```

2. Deploy from the Vercel dashboard or using the Vercel CLI:
```
vercel --prod
```

### Step 4: Verify Google Cloud Console Settings

1. Make sure you've added your production frontend URL to the Authorized JavaScript origins:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add `https://katomaran-todo-app-cyy5.vercel.app` to Authorized JavaScript origins

### Step 5: Test the Deployment

1. Open your production site: https://katomaran-todo-app-cyy5.vercel.app
2. Try the Google login button
3. Check the browser console for any errors
4. If issues persist, test the environment variables using the env-test page:
   - https://katomaran-todo-app-cyy5.vercel.app/env-test.html

## Troubleshooting Vercel Deployments

If you continue to have issues with environment variables in Vercel:

1. Check your Vercel project settings:
   - Go to the Vercel dashboard
   - Navigate to your project settings
   - Go to the "Environment Variables" section
   - Make sure all the required variables are set correctly:
     - REACT_APP_API_URL=https://katomaran-todo-app-tdqg.onrender.com/api
     - REACT_APP_CLIENT_URL=https://katomaran-todo-app-cyy5.vercel.app
     - REACT_APP_SOCKET_URL=https://katomaran-todo-app-tdqg.onrender.com

2. Try redeploying:
   - Go to the Vercel dashboard
   - Select your project
   - Click "Redeploy" and select "Redeploy with existing build cache"

3. As a last resort, consider using the Vercel CLI to deploy with environment variables:
```
vercel --prod --build-env REACT_APP_API_URL=https://katomaran-todo-app-tdqg.onrender.com/api --build-env REACT_APP_CLIENT_URL=https://katomaran-todo-app-cyy5.vercel.app --build-env REACT_APP_SOCKET_URL=https://katomaran-todo-app-tdqg.onrender.com
```
