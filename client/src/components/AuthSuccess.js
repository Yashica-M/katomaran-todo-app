import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import troubleshootOAuth from '../utils/oauthTroubleshooter';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { handleLoginSuccess } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = searchParams.get('token');
    const errorMsg = searchParams.get('error');
    const errorMessage = searchParams.get('message');
    
    console.log('Auth Success page loaded');
    console.log('Token present:', !!token);
    
    // Clear the auth redirect tracking
    sessionStorage.removeItem('auth_redirect_attempted');
    sessionStorage.removeItem('auth_redirect_time');
    
    if (errorMsg) {
      console.error('Authentication error:', errorMsg, errorMessage || 'No details');
      setError(`Authentication failed: ${errorMessage || errorMsg}`);
      
      // Run troubleshooter on error
      console.log('Running OAuth troubleshooter due to auth error...');
      troubleshootOAuth();
      
      // Still redirect to login after a delay
      setTimeout(() => navigate('/login?troubleshoot=true'), 5000);
    } else if (token) {
      // Handle successful login with the received token
      console.log('Login successful, token received');
      handleLoginSuccess(token);
      
      // Redirect to the add task page
      navigate('/add-task');
    } else {
      console.error('No token received in auth callback');
      setError('No authentication token received');
      
      // Run troubleshooter on missing token
      console.log('Running OAuth troubleshooter due to missing token...');
      troubleshootOAuth();
      
      // Redirect to login if no token
      setTimeout(() => navigate('/login?troubleshoot=true'), 5000);
    }
  }, [searchParams, handleLoginSuccess, navigate]);
  
  return (
    <div className="auth-success">
      {error ? (
        <div className="error-message">
          <h3>Authentication Error</h3>
          <p>{error}</p>
          <div className="troubleshooting-info">
            <h4>Troubleshooting:</h4>
            <ul>
              <li>Check that you have cookies enabled</li>
              <li>Make sure your browser allows redirects from Google</li>
              <li>Verify your Google OAuth configuration in Google Cloud Console</li>
              <li>Check that Authorized JavaScript origins include: {window.location.origin}</li>
            </ul>
          </div>
          <p>Redirecting to login page in a few seconds...</p>
        </div>
      ) : (
        <div className="loading">
          Logging in...
        </div>
      )}
    </div>
  );
};

export default AuthSuccess;
