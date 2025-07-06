import React from 'react';
import TodoForm from './TodoForm';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AddTaskPage = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="add-task-page">
      <Header />
      
      <div className="container">
        <div className="todo-app">
          <div className="todo-header">
            <h1>Add New Task</h1>
            <p className="welcome-message">
              Hello, {currentUser?.name || 'User'}!
              Create a new task below.
            </p>
          </div>
          
          <div className="add-task-container">
            <div className="form-panel">
              <h2>Task Details</h2>
              <TodoForm />
              <div className="form-footer">
                <Link to="/" className="btn btn-secondary">
                  Cancel & Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPage;
