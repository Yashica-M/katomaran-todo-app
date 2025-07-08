// This file will be overwritten during build with actual environment values
// These defaults ensure the app can run if the build process misses this file

window.ENV_NODE_ENV = "production";
window.ENV_REACT_APP_API_URL = "https://katomaran-todo-app-tdqg.onrender.com/api";
window.ENV_REACT_APP_CLIENT_URL = "https://katomaran-todo-app-cyy5.vercel.app";
window.ENV_REACT_APP_SOCKET_URL = "https://katomaran-todo-app-tdqg.onrender.com";

// CRITICAL FIX: Override all environment variables with hardcoded production values
// This ensures that even if the environment variables aren't loaded properly, the app will work
if (window.location.hostname !== 'localhost') {
  console.log('Forcing production URLs in runtime environment');
  
  // Override React env variables with our hardcoded production values
  process.env = process.env || {};
  process.env.REACT_APP_API_URL = "https://katomaran-todo-app-tdqg.onrender.com/api";
  process.env.REACT_APP_CLIENT_URL = "https://katomaran-todo-app-cyy5.vercel.app";
  process.env.REACT_APP_SOCKET_URL = "https://katomaran-todo-app-tdqg.onrender.com";
  process.env.NODE_ENV = "production";
}

console.log('Runtime environment variables loaded with production fallbacks');
