# Git Push Instructions

It seems there may be issues with pushing your changes directly from the terminal. Here are the detailed steps to push your code changes to GitHub:

## Option 1: Using Visual Studio Code Git Interface

1. Open Visual Studio Code
2. Click on the Source Control icon in the sidebar (or press Ctrl+Shift+G)
3. Review your changes
4. Enter a commit message: "Fix Google OAuth issues with hardcoded URLs and runtime environment variables"
5. Click the Commit button (✓)
6. Click the More Actions button (...)
7. Select "Push" 
8. If prompted to set an upstream branch, click "OK"

## Option 2: Using GitHub Desktop

If you have GitHub Desktop installed:

1. Open GitHub Desktop
2. It should automatically detect the changes in your repository
3. Enter the commit message
4. Click "Commit to master"
5. Click "Push origin"

## Option 3: Manual Git Commands (in Command Prompt, not PowerShell)

PowerShell has issues with some Git command syntax. Try using Command Prompt instead:

```
cmd
cd D:\ToDoApp
git add .
git commit -m "Fix Google OAuth issues with hardcoded URLs and runtime environment variables" 
git push -u origin master
```

If you're prompted for credentials, enter your GitHub username and token/password.

## If None of the Above Work

Try creating a new Personal Access Token in GitHub:

1. Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens
2. Generate a new token with "repo" permissions
3. Copy the token
4. Try pushing again, and when prompted for a password, use the token instead

## After Successfully Pushing

1. Go to your Vercel dashboard
2. Verify that a new deployment is automatically triggered
3. If not, manually trigger a new deployment
4. Once deployed, test your application again

Remember that the key fix we made was to hardcode the Google OAuth URL in the Login.js component to:
`https://katomaran-todo-app-tdqg.onrender.com/api/auth/google`

This should bypass any issues with environment variables not being correctly loaded in the production build.
