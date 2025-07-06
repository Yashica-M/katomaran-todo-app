import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { handleLoginSuccess } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Handle successful login with the received token
      handleLoginSuccess(token);
      
      // Redirect to the add task page
      navigate('/add-task');
    } else {
      // Redirect to login if no token
      navigate('/login');
    }
  }, [searchParams, handleLoginSuccess, navigate]);
  
  return (
    <div className="auth-success">
      <div className="loading">
        Logging in...
      </div>
    </div>
  );
};

export default AuthSuccess;
