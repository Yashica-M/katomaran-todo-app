import React from 'react';
import TodoItem from './TodoItem';
import { useTodo } from '../contexts/TodoContext';

const TodoList = () => {
  const { filteredTodos, loading } = useTodo();
  
  // Make sure filteredTodos is always an array
  const todos = Array.isArray(filteredTodos) ? filteredTodos : [];
  
  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }
  
  if (todos.length === 0) {
    return <div className="empty-list">No todos found. Add a new one!</div>;
  }
  
  return (
    <div className="todo-container">
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
