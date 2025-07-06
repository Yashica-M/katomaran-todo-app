import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { todoApi } from '../api';

// Create the context
const TodoContext = createContext();

// Define initial state
const initialState = {
  todos: [], // Always initialize as empty array
  loading: false,
  error: null,
  filters: {
    status: 'all', // all, pending, in_progress, completed
    priority: 'all', // all, low, medium, high
    dueDate: 'all', // all, today, overdue
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Define action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  GET_TODOS: 'GET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_FILTERS: 'SET_FILTERS',
  SHARE_TODO: 'SHARE_TODO',
  SET_SORT_OPTIONS: 'SET_SORT_OPTIONS',
};

// Define reducer function
const todoReducer = (state, action) => {
  // Make sure todos is always an array
  const todos = Array.isArray(state.todos) ? state.todos : [];
  
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.GET_TODOS:
      return { 
        ...state, 
        todos: Array.isArray(action.payload) ? action.payload : [], 
        loading: false 
      };
    case actionTypes.ADD_TODO:
      return { ...state, todos: [action.payload, ...todos], loading: false };
    case actionTypes.UPDATE_TODO:
      return {
        ...state,
        todos: todos.map((todo) => 
          todo._id === action.payload._id ? action.payload : todo
        ),
        loading: false,
      };
    case actionTypes.DELETE_TODO:
      return {
        ...state,
        todos: todos.filter((todo) => todo._id !== action.payload),
        loading: false,
      };
    case actionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case actionTypes.SHARE_TODO:
      return {
        ...state,
        todos: todos.map((todo) => 
          todo._id === action.payload.todoId ? 
          { ...todo, sharedWith: [...(todo.sharedWith || []), action.payload.email] } : 
          todo
        ),
      };
    case actionTypes.SET_SORT_OPTIONS:
      return { 
        ...state, 
        sortBy: action.payload.sortBy, 
        sortOrder: action.payload.sortOrder
      };
    default:
      return state;
  }
};

// Create provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { currentUser } = useAuth();

  // Fetch todos from API
  const fetchTodos = async () => {
    if (!currentUser) return;
    
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await todoApi.getAllTodos();
      // Make sure we have a valid response
      const todos = Array.isArray(response) ? response : [];
      dispatch({ type: actionTypes.GET_TODOS, payload: todos });
    } catch (error) {
      toast.error('Failed to fetch todos');
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      // Reset todos to empty array on error
      dispatch({ type: actionTypes.GET_TODOS, payload: [] });
    }
  };

  // Apply filters locally instead of fetching from API
  const fetchFilteredTodos = async () => {
    if (!currentUser) return;
    
    // We'll just update the UI to reflect the filter change
    // No need to make an API call in our simplified app
    dispatch({ type: actionTypes.SET_LOADING, payload: false });
  };

  // Add a new todo
  const addTodo = async (todoData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const newTodo = await todoApi.createTodo(todoData);
      dispatch({ type: actionTypes.ADD_TODO, payload: newTodo });
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Update an existing todo
  const updateTodo = async (id, todoData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const updatedTodo = await todoApi.updateTodo(id, todoData);
      dispatch({ type: actionTypes.UPDATE_TODO, payload: updatedTodo });
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      await todoApi.deleteTodo(id);
      dispatch({ type: actionTypes.DELETE_TODO, payload: id });
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Toggle todo status between pending, in_progress, and completed
  const toggleTodoStatus = async (todo) => {
    let newStatus;
    switch (todo.status) {
      case 'pending':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }

    await updateTodo(todo._id, { ...todo, status: newStatus });
  };

  // Share a todo with another user
  const shareTodo = async (id, email) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      await todoApi.shareTodo(id, email);
      dispatch({
        type: actionTypes.SHARE_TODO,
        payload: { todoId: id, email }
      });
      toast.success(`Todo shared with ${email}`);
    } catch (error) {
      toast.error('Failed to share todo');
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Set filters for todos
  const setFilters = (filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  };

  // Set sort options for todos
  const setSortOptions = (sortOptions) => {
    dispatch({ type: actionTypes.SET_SORT_OPTIONS, payload: sortOptions });
  };

  // Fetch todos when the component mounts or when the user changes
  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser]);

  // Refresh todos when filters change
  useEffect(() => {
    if (currentUser) {
      // We don't need to fetch from API for filtering in simplified app
      // The applyFilters function will handle filtering locally
    }
  }, [state.filters]);

  // Apply filters locally
  const applyFilters = () => {
    const todos = Array.isArray(state.todos) ? state.todos : [];
    
    return todos.filter(todo => {
      // Filter by status
      if (state.filters.status !== 'all' && todo.status !== state.filters.status) {
        return false;
      }
      
      // Filter by priority
      if (state.filters.priority !== 'all' && todo.priority !== state.filters.priority) {
        return false;
      }
      
      // Filter by due date
      if (state.filters.dueDate !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
        
        if (state.filters.dueDate === 'today') {
          // Due today
          if (!dueDate || dueDate.toDateString() !== today.toDateString()) {
            return false;
          }
        } else if (state.filters.dueDate === 'overdue') {
          // Overdue
          if (!dueDate || dueDate >= today) {
            return false;
          }
        }
      }
      
      return true;
    });
  };
  
  // Get filtered todos
  const filteredTodos = applyFilters();

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        fetchFilteredTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoStatus,
        shareTodo,
        setFilters,
        setSortOptions,
        filteredTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Create custom hook to use the todo context
export const useTodo = () => useContext(TodoContext);
