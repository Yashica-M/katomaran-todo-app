const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user from JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
