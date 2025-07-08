import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import troubleshootOAuth from '../utils/oauthTroubleshooter';

const Login = () => {
  const { isLoading } = useAuth();
  
  // Run troubleshooter in development or if URL parameter is present
  useEffect(() => {
    // Check for troubleshoot parameter or if running in development
    const urlParams = new URLSearchParams(window.location.search);
    const runTroubleshooter = urlParams.get('troubleshoot') === 'true' || process.env.NODE_ENV === 'development';
    
    if (runTroubleshooter) {
      // Add a slight delay to ensure everything is loaded
      setTimeout(() => {
        console.log('Running OAuth troubleshooter...');
        troubleshootOAuth();
      }, 1000);
    }
  }, []);
  
const handleGoogleLogin = () => {
  // Enhanced debugging with build and runtime info
  console.log('Build time env vars loaded:', process.env.NODE_ENV);
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('REACT_APP_CLIENT_URL:', process.env.REACT_APP_CLIENT_URL);
  
  // CRITICAL FIX: Force use of production URL in all environments
  // This ensures we always go to the production backend, not localhost
  const productionApiUrl = "https://katomaran-todo-app-tdqg.onrender.com/api";
  
  console.log('Using hardcoded production API URL for reliability');
  console.log('Auth URL to use:', `${productionApiUrl}/auth/google`);
  
  // Prepare to track if the redirect happens
  sessionStorage.setItem('auth_redirect_attempted', 'true');
  sessionStorage.setItem('auth_redirect_time', new Date().toISOString());
  
  // FIXED: Always use the hardcoded production URL for Google auth
  // This bypasses any environment variable issues
  window.location.href = `${productionApiUrl}/auth/google`;
};
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to ToDo App</h2>
        <p>Login to manage your tasks efficiently</p>
        
        <div className="login-buttons">
          <button className="login-button google-login" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Sign in with Google
          </button>
        </div>
        
        <div className="login-footer">
          <p>Manage your tasks, collaborate with others, and stay organized.</p>
          
          {process.env.NODE_ENV === 'production' && 
            <div className="login-troubleshoot">
              <details>
                <summary>Having trouble logging in?</summary>
                <div className="troubleshoot-tips">
                  <p>If you're experiencing issues with Google login:</p>
                  <ol>
                    <li>Make sure cookies are enabled in your browser</li>
                    <li>Try clearing your browser cache and cookies</li>
                    <li>Check if your ad blocker is preventing redirects</li>
                    <li>Try using a different browser</li>
                  </ol>
                </div>
              </details>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Login;
