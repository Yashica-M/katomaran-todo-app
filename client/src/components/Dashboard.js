import React, { useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import Header from './Header';
import { useTodo } from '../contexts/TodoContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { 
    fetchTodos, 
    filteredTodos, 
    loading
  } = useTodo();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    fetchTodos();
  }, [currentUser]);
  
  return (
    <div className="dashboard">
      <Header />
      
      <div className="container">
        <div className="todo-app">
          <div className="todo-header">
            <h1>My Tasks</h1>
            
            <div className="todo-count">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{Array.isArray(filteredTodos) ? filteredTodos.length : 0} task{Array.isArray(filteredTodos) && filteredTodos.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          
          <TodoForm />
          <TodoFilters />
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
