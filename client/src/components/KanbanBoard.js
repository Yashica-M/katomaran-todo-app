import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import EnhancedTodoItem from './EnhancedTodoItem';

const KanbanBoard = () => {
  const { filteredTodos, updateTodo } = useTodo();
  const [isDragging, setIsDragging] = useState(false);
  
  // Group todos by status
  const todosByStatus = {
    pending: filteredTodos.filter(todo => todo.status === 'pending'),
    in_progress: filteredTodos.filter(todo => todo.status === 'in_progress'),
    completed: filteredTodos.filter(todo => todo.status === 'completed')
  };

  // Handle status change
  const handleStatusChange = (todoId, newStatus) => {
    const todo = filteredTodos.find(todo => todo._id === todoId);
    if (todo) {
      updateTodo(todoId, {
        ...todo,
        status: newStatus
      });
    }
  };

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        <div className="kanban-column">
          <h3 className="column-header">
            <span className="column-icon pending">📝</span>
            Pending
            <span className="todo-count">{todosByStatus.pending.length}</span>
          </h3>
          <div className="column-content">
            {todosByStatus.pending.length === 0 ? (
              <div className="empty-column">No pending tasks</div>
            ) : (
              todosByStatus.pending.map((todo) => (
                <div className="kanban-item" key={todo._id}>
                  <EnhancedTodoItem todo={todo} />
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="kanban-column">
          <h3 className="column-header">
            <span className="column-icon in-progress">⏳</span>
            In Progress
            <span className="todo-count">{todosByStatus.in_progress.length}</span>
          </h3>
          <div className="column-content">
            {todosByStatus.in_progress.length === 0 ? (
              <div className="empty-column">No tasks in progress</div>
            ) : (
              todosByStatus.in_progress.map((todo) => (
                <div className="kanban-item" key={todo._id}>
                  <EnhancedTodoItem todo={todo} />
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="kanban-column">
          <h3 className="column-header">
            <span className="column-icon completed">✅</span>
            Completed
            <span className="todo-count">{todosByStatus.completed.length}</span>
          </h3>
          <div className="column-content">
            {todosByStatus.completed.length === 0 ? (
              <div className="empty-column">No completed tasks</div>
            ) : (
              todosByStatus.completed.map((todo) => (
                <div className="kanban-item" key={todo._id}>
                  <EnhancedTodoItem todo={todo} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
