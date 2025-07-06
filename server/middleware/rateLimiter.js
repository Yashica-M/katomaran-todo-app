// Rate limiting middleware to prevent API abuse
const expressRateLimit = require('express-rate-limit');

// Create rate limiter using express-rate-limit
const createRateLimiter = (options) => {
  const { windowMs = 60000, max = 100, message = 'Too many requests, please try again later.' } = options || {};
  
  return expressRateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: 429,
      message
    },
    keyGenerator: (req) => {
      // Use IP address as the key
      return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    }
  });
};

// Legacy rate limiter (custom implementation) - kept for reference
const customRateLimit = (options) => {
  const { windowMs = 60000, max = 100, message = 'Too many requests, please try again later.' } = options || {};
  
  // Store for keeping track of requests
  const cache = new Map();
  
  // Clean up cache every windowMs
  setInterval(() => {
    const now = Date.now();
    cache.forEach((value, key) => {
      if (now - value.timestamp > windowMs) {
        cache.delete(key);
      }
    });
  }, windowMs);
  
  // The rate limiting middleware
  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    
    // Get or create the record for this IP
    if (!cache.has(key)) {
      cache.set(key, {
        count: 1,
        timestamp: now
      });
      return next();
    }
    
    const record = cache.get(key);
    
    // If the window has passed, reset the count
    if (now - record.timestamp > windowMs) {
      record.count = 1;
      record.timestamp = now;
      return next();
    }
    
    // If the count is less than max, increment and proceed
    if (record.count < max) {
      record.count++;
      return next();
    }
    
    // Otherwise, rate limit has been exceeded
    return res.status(429).json({
      message,
      retryAfter: Math.ceil((record.timestamp + windowMs - now) / 1000)
    });
  };
};

// Different rate limiters for different routes
// Use the express-rate-limit implementation
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many authentication attempts, please try again after 15 minutes.'
});

const todoLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many todo operations, please slow down.'
});

const shareLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 share operations per hour
  message: 'Too many share operations, please try again after an hour.'
});

// Generic limiter for API routes
const apiLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // Limit each IP to 300 requests per 5 minutes
  message: 'Too many API requests, please try again after 5 minutes.'
});

module.exports = {
  authLimiter,
  todoLimiter,
  shareLimiter,
  apiLimiter
};
