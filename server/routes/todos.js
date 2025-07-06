const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all todos for current user (including shared todos) with pagination
router.get('/', auth, async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder;
    
    // Get todos created by the user with pagination
    const userTodos = await Todo.find({ user: req.user.id })
      .sort(sort)
      .limit(limit)
      .skip(skipIndex);
      
    // Get todos shared with the user with pagination
    const sharedTodos = await Todo.find({
      'sharedWith.user': req.user.id
    })
      .sort(sort)
      .limit(limit)
      .skip(skipIndex);
    
    // Combine both sets of todos
    let todos = [...userTodos, ...sharedTodos];
    
    // Sort combined results
    if (sortOrder === 1) {
      todos.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
    } else {
      todos.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1);
    }
    
    // Limit combined results to requested limit
    todos = todos.slice(0, limit);
    
    // Get total count for pagination
    const totalUserTodos = await Todo.countDocuments({ user: req.user.id });
    const totalSharedTodos = await Todo.countDocuments({ 'sharedWith.user': req.user.id });
    const totalTodos = totalUserTodos + totalSharedTodos;
    
    res.json({
      todos,
      pagination: {
        total: totalTodos,
        page,
        limit,
        pages: Math.ceil(totalTodos / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todos by filter (due today, overdue, priority, status) with pagination
router.get('/filter', auth, async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'dueDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder;
    // Add secondary sort by creation date
    if (sortBy !== 'createdAt') {
      sort['createdAt'] = -1;
    }
    
    const filter = { user: req.user.id };
    
    // Add filters if provided
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Filter for due today
    if (dueDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filter.dueDate = {
        $gte: today,
        $lt: tomorrow
      };
    }
    
    // Filter for overdue
    if (dueDate === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filter.dueDate = { $lt: today };
      filter.status = { $ne: 'completed' };
    }
    
    // Get filtered todos with pagination
    const todos = await Todo.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skipIndex);
    // Get total count for pagination
    const totalTodos = await Todo.countDocuments(filter);
    
    res.json({
      todos,
      pagination: {
        total: totalTodos,
        page,
        limit,
        pages: Math.ceil(totalTodos / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single todo
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if user owns this todo or it's shared with them
    const isOwner = todo.user.toString() === req.user.id;
    const isShared = todo.sharedWith.some(
      share => share.user && share.user.toString() === req.user.id
    );
    
    if (!isOwner && !isShared) {
      return res.status(403).json({ message: 'Not authorized to access this todo' });
    }
    
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate,
      user: req.user.id
    });

    const todo = await newTodo.save();
    
    // If Socket.io is set up, emit event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id).emit('todo-updated', { action: 'create', todo });
    }
    
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const todoFields = {};
    if (title !== undefined) todoFields.title = title;
    if (description !== undefined) todoFields.description = description;
    if (status !== undefined) todoFields.status = status;
    if (priority !== undefined) todoFields.priority = priority;
    if (dueDate !== undefined) todoFields.dueDate = dueDate;

    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if user owns this todo or it's shared with them
    const isOwner = todo.user.toString() === req.user.id;
    const isShared = todo.sharedWith.some(
      share => share.user && share.user.toString() === req.user.id
    );
    
    if (!isOwner && !isShared) {
      return res.status(403).json({ message: 'Not authorized to update this todo' });
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: todoFields },
      { new: true }
    );

    // If Socket.io is set up, emit event for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to owner
      io.to(todo.user.toString()).emit('todo-updated', { action: 'update', todo });
      
      // Emit to all users with whom the todo is shared
      todo.sharedWith.forEach(share => {
        if (share.user) {
          io.to(share.user.toString()).emit('todo-updated', { action: 'update', todo });
        }
      });
    }

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Only the owner can delete a todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this todo' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    
    // If Socket.io is set up, emit event for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to owner
      io.to(req.user.id).emit('todo-updated', { action: 'delete', todoId: req.params.id });
      
      // Emit to all users with whom the todo is shared
      todo.sharedWith.forEach(share => {
        if (share.user) {
          io.to(share.user.toString()).emit('todo-updated', { 
            action: 'delete', 
            todoId: req.params.id 
          });
        }
      });
    }
    
    res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share a todo with another user
const { shareLimiter } = require('../middleware/rateLimiter');
router.post('/:id/share', auth, shareLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find the todo
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Only the owner can share a todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to share this todo' });
    }
    
    // Find the user to share with by email
    const userToShareWith = await User.findOne({ email });
    
    if (!userToShareWith) {
      // If user doesn't exist, still add the email for future reference
      todo.sharedWith.push({ email });
      await todo.save();
      return res.json({ message: `Todo shared with ${email} (user not yet registered)` });
    }
    
    // Don't share with the owner
    if (userToShareWith.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot share with yourself' });
    }
    
    // Check if todo is already shared with this user
    const alreadyShared = todo.sharedWith.some(
      share => share.user && share.user.toString() === userToShareWith.id
    );
    
    if (alreadyShared) {
      return res.status(400).json({ message: 'Todo already shared with this user' });
    }
    
    // Add user to sharedWith array
    todo.sharedWith.push({
      user: userToShareWith.id,
      email: userToShareWith.email
    });
    
    await todo.save();
    
    // Add todo to user's sharedTasks array
    userToShareWith.sharedTasks.push(todo.id);
    await userToShareWith.save();
    
    // If Socket.io is set up, emit event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(userToShareWith.id).emit('todo-shared', { todo });
    }
    
    res.json({ message: `Todo shared with ${userToShareWith.email} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
