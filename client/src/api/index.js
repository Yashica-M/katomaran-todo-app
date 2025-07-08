import axios from 'axios';

// FIXED: Always use the production URL instead of falling back to localhost
// This ensures API calls always go to production in deployed environments
const PRODUCTION_API_URL = 'https://katomaran-todo-app-tdqg.onrender.com/api';
const API_URL = process.env.NODE_ENV === 'development' ? 
  (process.env.REACT_APP_API_URL || 'http://localhost:5000/api') : 
  PRODUCTION_API_URL;

console.log('API Service using URL:', API_URL);

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const todoApi = {
  getAllTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },
  
  getFilteredTodos: async (filters) => {
    try {
      let queryParams = [];
      
      if (filters.status && filters.status !== 'all') {
        queryParams.push(`status=${filters.status}`);
      }
      
      if (filters.priority && filters.priority !== 'all') {
        queryParams.push(`priority=${filters.priority}`);
      }
      
      if (filters.dueDate && filters.dueDate !== 'all') {
        queryParams.push(`dueDate=${filters.dueDate}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await api.get(`/todos/filter${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered todos:', error);
      throw error;
    }
  },
  
  getTodo: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      throw error;
    }
  },
  
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },
  
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },
  
  deleteTodo: async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  },
  
  shareTodo: async (id, email) => {
    try {
      const response = await api.post(`/todos/${id}/share`, { email });
      return response.data;
    } catch (error) {
      console.error(`Error sharing todo ${id}:`, error);
      throw error;
    }
  }
};

export const authApi = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.get('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
};

export default api;
