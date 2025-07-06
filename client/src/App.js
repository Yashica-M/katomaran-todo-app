import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/additional.css';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AuthSuccess from './components/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import AddTaskPage from './components/AddTaskPage';

import { AuthProvider } from './contexts/AuthContext';
import { TodoProvider } from './contexts/TodoContext';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warn('You are offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <TodoProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-task" 
                element={
                  <ProtectedRoute>
                    <AddTaskPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <ToastContainer 
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            
            {!isOnline && (
              <div className="offline-indicator">
                You are currently offline
              </div>
            )}
          </TodoProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
