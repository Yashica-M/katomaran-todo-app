const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { generateToken } = require('../config/passport');
const User = require('../models/User');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user);
      
      // Log successful authentication
      console.log(`User authenticated: ${req.user.name}`);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=AuthFailure`);
    }
  }
);

// Get current authenticated user
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-__v -password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  if (req.logout) {
    req.logout(function(err) {
      if (err) { 
        return res.status(500).json({ message: 'Error during logout' }); 
      }
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.json({ message: 'Logged out successfully' });
  }
});

// Verify token
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, message: 'No token provided' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ valid: false, message: 'User not found' });
        }
        
        res.json({ valid: true, user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }});
      })
      .catch(err => {
        console.error('Error finding user:', err);
        res.status(500).json({ valid: false, message: 'Server error' });
      });
  } catch (err) {
    console.error('Token verification error:', err);
    res.json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;
