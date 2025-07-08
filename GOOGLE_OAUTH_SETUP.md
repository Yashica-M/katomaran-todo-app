# Google OAuth Configuration Guide

Based on the screenshot shared, there are configuration issues with your Google OAuth setup that need to be fixed for proper authentication in production.

## Required Changes in Google Cloud Console

### 1. Authorized JavaScript Origins

Currently, only `http://localhost:3000` is added, but you need to add your production frontend URL:

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Edit your OAuth 2.0 Client ID
3. Under "Authorized JavaScript origins", click "ADD URI"
4. Add your Vercel production URL: `https://katomaran-todo-app-cyy5.vercel.app`
5. Keep `http://localhost:3000` for local development

### 2. Authorized Redirect URIs

Currently set to: `https://katomaran-todo-app-tdqg.onrender.com/api/auth/google/callback`

This appears to be correct, but ensure it exactly matches your server configuration. If you're getting redirect errors, verify:

1. The URL matches exactly what's defined in your passport.js configuration
2. No trailing slashes or typos exist
3. The API base URL is included if needed in the path

## Complete Configuration Checklist

- [x] Backend deployed to Render (`https://katomaran-todo-app-tdqg.onrender.com`)
- [x] Frontend deployed to Vercel (`https://katomaran-todo-app-cyy5.vercel.app`) 
- [ ] Add production frontend URL to Authorized JavaScript Origins
- [x] Verify Authorized Redirect URI is correct
- [ ] Ensure CLIENT_URL in server environment points to frontend URL
- [x] Ensure REACT_APP_API_URL in client environment points to backend API

## Testing After Configuration

After updating these settings:

1. Wait a few minutes for Google's systems to propagate the changes
2. Clear your browser cookies and cache
3. Try signing in again with Google
4. Monitor the browser console and network tab for any errors
5. Check the server logs in Render for authentication errors

## Common Error Messages and Solutions

- **Error: redirect_uri_mismatch**: The redirect URI doesn't match any configured URIs
  - Solution: Ensure the exact URL is added to Authorized redirect URIs
  
- **Error: Invalid Origin**: The request came from an unauthorized origin
  - Solution: Add your frontend URL to Authorized JavaScript origins
  
- **Error: Failed to fetch**: CORS issues or API URL incorrect
  - Solution: Check your REACT_APP_API_URL is correct and server CORS is properly configured

## Verifying the Fix

Once you've made these changes, the Google login should work properly. The authentication flow should:

1. Redirect from your frontend to Google's authentication page
2. After successful Google authentication, redirect to your backend callback URL
3. Your backend creates/updates the user and generates a JWT token
4. The user is redirected back to your frontend with the token
5. Your frontend stores the token and redirects to the dashboard

If problems persist after making these changes, please check your server logs for more detailed error information.
