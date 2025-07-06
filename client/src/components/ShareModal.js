import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';

const ShareModal = ({ todo, onClose }) => {
  const [email, setEmail] = useState('');
  const { shareTodo } = useTodo();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    try {
      await shareTodo(todo._id, email);
      onClose();
    } catch (error) {
      console.error('Error sharing todo:', error);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Share Task</h3>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <p>Share "{todo.title}" with another user</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Share</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
