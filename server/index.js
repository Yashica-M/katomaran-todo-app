const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
const { authLimiter, todoLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Session setup (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import Passport config
try {
  // Explicitly import and configure passport
  const passportConfig = require('./config/passport');
  console.log('Passport configuration loaded successfully');
} catch (error) {
  console.error('Error loading passport configuration:', error);
  console.error(error.stack);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import API limiter
const { apiLimiter } = require('./middleware/rateLimiter');

// Apply API rate limiter to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('ToDo API is running');
});

// Production setup for serving the ToDo app
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Handle frontend routing, return all requests to the app
  app.get('*', function(req, res, next) {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Socket.IO connection handlers
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Authenticate socket connection
  socket.on('authenticate', ({ token }) => {
    try {
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
      
      // Join a room specific to this user
      socket.join(decoded.id);
      console.log(`User ${decoded.id} authenticated on socket`);
      
      // Notify client of successful authentication
      socket.emit('authenticated', { userId: decoded.id });
    } catch (err) {
      console.error('Socket authentication error:', err);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server with automatic port selection if the default port is in use
(async () => {
  try {
    const availablePort = await findAvailablePort(PORT);
    httpServer.listen(availablePort, () => {
      const portMessage = availablePort === PORT 
        ? `Server running on port ${availablePort}` 
        : `Port ${PORT} was in use, server started on port ${availablePort} instead`;
      console.log(portMessage);
      
      // If we're using a different port, log information for environment variables
      if (availablePort !== PORT) {
        console.log('\x1b[33m%s\x1b[0m', `Note: Update your client's .env file with REACT_APP_API_URL=http://localhost:${availablePort}/api`);
        console.log('\x1b[33m%s\x1b[0m', `and REACT_APP_SOCKET_URL=http://localhost:${availablePort}`);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
