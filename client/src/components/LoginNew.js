import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// This is a completely rewritten Login component that uses hardcoded URLs
// NO environment variables are used at all to avoid any issues
const Login = () => {
  const { isLoading } = useAuth();
  
  // Completely hardcoded Google auth handler - no environment variables used
  const handleGoogleLogin = () => {
    console.log('Using direct hardcoded production URL for Google auth');
    
    // Track the redirect for debugging
    try {
      localStorage.setItem('auth_redirect_attempted', 'true');
      localStorage.setItem('auth_redirect_time', new Date().toISOString());
    } catch (e) {
      console.error('Failed to set localStorage:', e);
    }
    
    // HARDCODED URL: No environment variables, just direct string
    const hardcodedUrl = 'https://katomaran-todo-app-tdqg.onrender.com/api/auth/google';
    console.log('Redirecting to:', hardcodedUrl);
    
    // Use window.location.replace for more reliable redirect
    window.location.replace(hardcodedUrl);
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
        </div>
      </div>
    </div>
  );
};

export default Login;
