import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  return (
    <header className="app-header">
      <div className="header-logo">
        <h2><Link to="/" className="header-title">ToDo App</Link></h2>
      </div>
      
      {isAuthenticated && (
        <div className="header-nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/add-task" className="nav-link">Add Task</Link>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="user-info">
          <span className="user-name">{currentUser?.name}</span>
          <button className="btn btn-secondary logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
