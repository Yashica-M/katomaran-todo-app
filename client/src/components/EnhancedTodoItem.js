import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import TodoForm from './TodoForm';
import ShareModal from './ShareModal';
import { useAuth } from '../contexts/AuthContext';

const EnhancedTodoItem = ({ todo, isDragging }) => {
  const { toggleTodoStatus, deleteTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
  
  // Check if current user is the owner of the todo
  const isOwner = currentUser && todo.user && currentUser.id === todo.user;
  
  // Calculate days remaining or overdue
  const getDaysRemainingText = () => {
    if (!todo.dueDate) return null;
    
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };
  
  // Check if task is overdue
  const isOverdue = () => {
    if (!todo.dueDate || todo.status === 'completed') return false;
    
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  // Get status badge class
  const getStatusBadgeClass = () => {
    switch(todo.status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  // Handle priority change
  const handlePriorityChange = (newPriority) => {
    updateTodo(todo._id, { ...todo, priority: newPriority });
  };
  
  // Handle status toggle when action buttons are clicked
  const handleStatusToggle = () => {
    toggleTodoStatus(todo);
  };
  
  return (
    <>
      <div 
        className={`todo-item ${todo.status === 'completed' ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      >
        <div className={`priority-indicator priority-${todo.priority}`}></div>
        
        <div className="todo-header">
          <span className={`status-badge ${getStatusBadgeClass()}`}>
            {todo.status === 'completed' ? '✓ Completed' : 
             todo.status === 'in_progress' ? '⟳ In Progress' : '• Pending'}
          </span>
          
          {isOverdue() && (
            <span className="overdue-badge">Overdue</span>
          )}
        </div>
        
        <h3 className="todo-title">{todo.title}</h3>
        
        {/* Expandable content */}
        <div 
          className="todo-expandable"
          style={{ 
            height: showDetails ? 'auto' : '0px', 
            opacity: showDetails ? 1 : 0,
            overflow: 'hidden',
            transition: 'height 0.3s, opacity 0.3s'
          }}
        >
          {todo.description && (
            <div className="todo-description">
              <p>{todo.description}</p>
            </div>
          )}
          
          <div className="todo-details">
            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <div className="priority-selector">
                <button 
                  className={`priority-btn ${todo.priority === 'low' ? 'active' : ''}`}
                  style={{ backgroundColor: todo.priority === 'low' ? 'var(--secondary-color)' : 'transparent' }}
                  onClick={() => handlePriorityChange('low')}
                >
                  Low
                </button>
                <button 
                  className={`priority-btn ${todo.priority === 'medium' ? 'active' : ''}`}
                  style={{ backgroundColor: todo.priority === 'medium' ? 'var(--warning-color)' : 'transparent' }}
                  onClick={() => handlePriorityChange('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`priority-btn ${todo.priority === 'high' ? 'active' : ''}`}
                  style={{ backgroundColor: todo.priority === 'high' ? 'var(--danger-color)' : 'transparent' }}
                  onClick={() => handlePriorityChange('high')}
                >
                  High
                </button>
              </div>
            </div>
            
            {todo.sharedWith && todo.sharedWith.length > 0 && (
              <div className="detail-item">
                <span className="detail-label">Shared with</span>
                <div className="shared-users">
                  {todo.sharedWith.map((share, index) => (
                    <span key={index} className="shared-user">
                      {share.email || share.user}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="todo-footer">
          <div className="due-date">
            {todo.dueDate && (
              <span className={`due-date-text ${isOverdue() ? 'overdue' : ''}`}>
                <i className="due-date-icon">📅</i> {formatDate(todo.dueDate)}
                {getDaysRemainingText() && (
                  <small className="days-remaining"> ({getDaysRemainingText()})</small>
                )}
              </span>
            )}
          </div>
          
          <div className="todo-actions">
            <button 
              className="btn-icon"
              onClick={() => setShowDetails(!showDetails)}
              aria-label={showDetails ? 'Hide details' : 'Show details'}
            >
              {showDetails ? '▲' : '▼'}
            </button>
            
            <button 
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              aria-label="Edit todo"
            >
              ✏️
            </button>
            
            <button 
              className="btn-icon"
              onClick={handleStatusToggle}
              aria-label="Toggle status"
            >
              {todo.status === 'completed' ? '↩️' : '✓'}
            </button>
            
            {isOwner && (
              <button 
                className="btn-icon"
                onClick={() => setIsSharing(true)}
                aria-label="Share todo"
              >
                🔗
              </button>
            )}
            
            <button 
              className="btn-icon"
              onClick={() => deleteTodo(todo._id)}
              aria-label="Delete todo"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <TodoForm
          todo={todo}
          onClose={() => setIsEditing(false)}
        />
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

export default EnhancedTodoItem;
