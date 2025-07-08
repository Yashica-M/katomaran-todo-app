import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Set up axios interceptor for adding token to requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // FIXED: Always use production API URL in production environment
      const apiBaseUrl = process.env.NODE_ENV === 'production' ? 
        'https://katomaran-todo-app-tdqg.onrender.com/api' : 
        process.env.REACT_APP_API_URL;
        
      console.log('AuthContext using API URL:', apiBaseUrl);
      
      try {
        const res = await axios.get(`${apiBaseUrl}/auth/me`);
        setCurrentUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken(null);
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, [token]);
  
  // Function to handle login success (for redirect from OAuth)
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };
  
  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        token,
        handleLoginSuccess,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
