// This script forces our production URLs to override any stored environment variables
// It runs before React loads to ensure environment variables are set correctly
(function() {
  // Check if we're in a production environment (not localhost)
  if (window.location.hostname !== 'localhost') {
    console.log('🔧 Applying critical URL overrides for production environment');
    
    // Create a global object to store our production URLs
    window.PRODUCTION_CONFIG = {
      API_URL: 'https://katomaran-todo-app-tdqg.onrender.com/api',
      CLIENT_URL: 'https://katomaran-todo-app-cyy5.vercel.app',
      SOCKET_URL: 'https://katomaran-todo-app-tdqg.onrender.com'
    };
    
    // Force override any process.env variables
    if (typeof process === 'undefined') {
      window.process = { env: {} };
    } else if (typeof process.env === 'undefined') {
      process.env = {};
    }
    
    // Set the critical environment variables
    process.env.REACT_APP_API_URL = window.PRODUCTION_CONFIG.API_URL;
    process.env.REACT_APP_CLIENT_URL = window.PRODUCTION_CONFIG.CLIENT_URL;
    process.env.REACT_APP_SOCKET_URL = window.PRODUCTION_CONFIG.SOCKET_URL;
    process.env.NODE_ENV = 'production';
    
    // Override the fetch function to intercept any requests to localhost:5000
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string' && url.includes('localhost:5000')) {
        console.warn('🚨 Intercepted fetch request to localhost:5000! Redirecting to production URL.');
        url = url.replace('http://localhost:5000', window.PRODUCTION_CONFIG.API_URL.replace('/api', ''));
      }
      return originalFetch.apply(this, [url, options]);
    };
    
    // Override XMLHttpRequest to intercept any requests to localhost:5000
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      if (typeof url === 'string' && url.includes('localhost:5000')) {
        console.warn('🚨 Intercepted XMLHttpRequest to localhost:5000! Redirecting to production URL.');
        url = url.replace('http://localhost:5000', window.PRODUCTION_CONFIG.API_URL.replace('/api', ''));
      }
      return originalOpen.apply(this, arguments);
    };
    
    console.log('✅ Production URL overrides applied successfully');
  }
})();
