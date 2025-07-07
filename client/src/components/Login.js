import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { isLoading } = useAuth();
  
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
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
        </div>
      </div>
    </div>
  );
};

export default Login;
