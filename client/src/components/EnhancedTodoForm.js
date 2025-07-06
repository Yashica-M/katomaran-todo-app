import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo } from '../contexts/TodoContext';
import { useNavigate, useLocation } from 'react-router-dom';

const EnhancedTodoForm = ({ editTodo = null, onClose = () => {} }) => {
  const { addTodo, updateTodo } = useTodo();
  const navigate = useNavigate();
  const location = useLocation();
  const isAddTaskPage = location.pathname === '/add-task';
  const isEditing = !!editTodo;
  
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
  
  const [isFormOpen, setIsFormOpen] = useState(isEditing);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEditing) {
      // Update existing todo
      updateTodo(editTodo._id, formData);
      onClose();
    } else {
      // Submit new todo
      addTodo(formData);
      
      // If on the add task page, navigate back to dashboard after adding
      if (isAddTaskPage) {
        navigate('/');
      } else {
        // Reset form and close it
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          dueDate: ''
        });
        setIsFormOpen(false);
      }
    }
  };
  
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  
  const formVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.1)"
    },
    tap: {
      scale: 0.97
    }
  };
  
  return (
    <div className="todo-form-container">
      {!isEditing && !isAddTaskPage && (
        <motion.button 
          className="btn btn-primary add-todo-btn"
          onClick={toggleForm}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          {isFormOpen ? 'Cancel' : '+ Add Task'}
        </motion.button>
      )}
      
      <AnimatePresence>
        {(isFormOpen || isEditing || isAddTaskPage) && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={formVariants}
            className="form-wrapper"
          >
            <form onSubmit={handleSubmit} className="todo-form">
              {(isEditing || isAddTaskPage) && (
                <div className="form-header">
                  <h3>{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
                  {!isAddTaskPage && (
                    <button 
                      type="button"
                      className="close-btn"
                      onClick={onClose}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
              
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Task title"
                />
                {errors.title && (
                  <div className="error-message">{errors.title}</div>
                )}
              </div>
              
              <div className="form-group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Add description (optional)"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="priority"
                        value="low"
                        checked={formData.priority === 'low'}
                        onChange={handleChange}
                      />
                      <span className="radio-custom low">Low</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="priority"
                        value="medium"
                        checked={formData.priority === 'medium'}
                        onChange={handleChange}
                      />
                      <span className="radio-custom medium">Medium</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="priority"
                        value="high"
                        checked={formData.priority === 'high'}
                        onChange={handleChange}
                      />
                      <span className="radio-custom high">High</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-control"
                    min={new Date().toISOString().substr(0, 10)}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <motion.button 
                  type="submit"
                  className="btn btn-primary"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  {isEditing ? 'Save Changes' : 'Add Task'}
                </motion.button>
                
                {!isAddTaskPage && !isEditing && (
                  <motion.button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsFormOpen(false)}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTodoForm;
