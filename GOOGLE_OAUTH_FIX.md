# Google OAuth Configuration Fix

Based on the screenshot you shared, I've identified the specific issue causing your Google OAuth to fail. Follow these steps to fix it:

## The Issue

In your Google Cloud Console, the "Authorized JavaScript origins" is set to:
- `http://localhost:3000` (only for local development)

But it's missing your production frontend URL:
- `https://katomaran-todo-app-cyy5.vercel.app` (needs to be added)

## Step-by-Step Fix

1. Log into your Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID and click the edit icon (pencil)
4. Under "Authorized JavaScript origins", click "ADD URI"
5. Add your production frontend URL: `https://katomaran-todo-app-cyy5.vercel.app`
6. Save your changes
7. Wait a few minutes for the changes to propagate (this can take 5-10 minutes)
8. Clear your browser cache and cookies
9. Try logging in again

## Already Correctly Configured

Your "Authorized redirect URIs" appears to be correctly set to:
- `https://katomaran-todo-app-tdqg.onrender.com/api/auth/google/callback`

## Why This Fixes the Issue

Google OAuth requires that the originating domain (your frontend) be explicitly listed in "Authorized JavaScript origins" for security reasons. Without this, Google will reject the authentication request even if your redirect URL is correct.

## Verification

After making these changes:
1. Open your application: https://katomaran-todo-app-cyy5.vercel.app
2. Open browser developer tools (F12)
3. Go to the Console tab
4. Try logging in with Google
5. Check if there are any error messages

If you still encounter issues after making these changes, run the troubleshooting tool we added by appending `?troubleshoot=true` to your login URL:
https://katomaran-todo-app-cyy5.vercel.app/login?troubleshoot=true
