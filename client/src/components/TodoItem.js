import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import TodoForm from './TodoForm';
import ShareModal from './ShareModal';
import { useAuth } from '../contexts/AuthContext';

const TodoItem = ({ todo }) => {
  const { toggleTodoStatus, deleteTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { currentUser } = useAuth();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const priorityClass = todo.priority || 'medium';
  const statusClass = todo.status || 'pending';
  const isOwner = currentUser && todo.user && currentUser.id === todo.user;
  
  const getStatusText = () => {
    switch(todo.status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };
  
  return (
    <>
      <div className={`todo-item ${priorityClass} ${statusClass}`}>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
        
        <div className="todo-meta">
          <div>Priority: <strong>{todo.priority}</strong></div>
          <div>Due: <strong>{formatDate(todo.dueDate)}</strong></div>
          <div>Status: <strong>{getStatusText()}</strong></div>
        </div>
        
        <div className="todo-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => toggleTodoStatus(todo)}
          >
            Toggle Status
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          
          {isOwner && (
            <button 
              className="btn btn-secondary"
              onClick={() => setIsSharing(true)}
            >
              Share
            </button>
          )}
          
          {isOwner && (
            <button 
              className="btn btn-danger"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <TodoForm 
              editTodo={todo} 
              onClose={() => setIsEditing(false)} 
            />
          </div>
        </div>
      )}
      
      {isSharing && (
        <ShareModal 
          todo={todo} 
          onClose={() => setIsSharing(false)} 
        />
      )}
    </>
  );
};

export default TodoItem;
