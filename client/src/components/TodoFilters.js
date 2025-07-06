import React from 'react';
import { useTodo } from '../contexts/TodoContext';

const TodoFilters = () => {
  const { filters, setFilters } = useTodo();
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // The filters will be applied automatically through the filteredTodos calculation
  };
  
  return (
    <div className="todo-filters">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="dueDate-filter">Due Date:</label>
        <select
          id="dueDate-filter"
          name="dueDate"
          value={filters.dueDate}
          onChange={handleFilterChange}
        >
          <option value="all">All Dates</option>
          <option value="today">Due Today</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
};

export default TodoFilters;
