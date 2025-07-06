const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables directly in this file to ensure they're available
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Passport with Google Strategy
try {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientID || !clientSecret) {
    throw new Error('Google OAuth credentials missing in environment variables');
  }
  
  console.log('Configuring Google Strategy with credentials');
  
passport.use(
  new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email'],
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google profile:', profile);
          
          // Find if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Update user info in case it changed
            user.name = profile.displayName;
            user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
            await user.save();
            
            return done(null, user);
          }

          // Create new user if doesn't exist
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });

          return done(null, user);
        } catch (err) {
          console.error('Error in Google Auth:', err);
          return done(err, null);
        }
      }
    )
  );
  console.log('Google authentication strategy configured successfully');
} catch (error) {
  console.error('Failed to configure Google authentication strategy:', error.message);
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Export the passport configuration and the generateToken function
module.exports = { 
  passport,
  generateToken 
};
