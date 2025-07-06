import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import { useNavigate, useLocation } from 'react-router-dom';

const TodoForm = ({ editTodo = null, onClose = () => {} }) => {
  const { addTodo, updateTodo } = useTodo();
  const navigate = useNavigate();
  const location = useLocation();
  const isAddTaskPage = location.pathname === '/add-task';
  const [formData, setFormData] = useState(
    editTodo ? {
      title: editTodo.title || '',
      description: editTodo.description || '',
      priority: editTodo.priority || 'medium',
      status: editTodo.status || 'pending',
      dueDate: editTodo.dueDate ? new Date(editTodo.dueDate).toISOString().substr(0, 10) : ''
    } : {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    }
  );
  const [isFormOpen, setIsFormOpen] = useState(!!editTodo);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (editTodo) {
      // Update existing todo
      updateTodo(editTodo._id, formData);
      onClose();
    } else {
      // Submit new todo
      addTodo(formData);
      
      // If on the add task page, navigate back to dashboard after adding
      if (isAddTaskPage) {
        navigate('/');
        return;
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });
      
      // Close form after submission
      setIsFormOpen(false);
    }
  };
  
  return (
    <div>
      {!isFormOpen && !editTodo ? (
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
          >
            Add New Task
          </button>
        </div>
      ) : (
        <div className="todo-form">
          <h3>{editTodo ? 'Edit Task' : 'Add New Task'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {editTodo && (
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                {editTodo ? 'Update Task' : 'Save Task'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  if (editTodo) {
                    onClose();
                  } else {
                    setIsFormOpen(false);
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoForm;
