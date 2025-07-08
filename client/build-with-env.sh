#!/bin/bash

# Script to build the React app with environment variables properly injected
# This ensures the environment variables are available at runtime

echo "========================================"
echo "Building React app with environment variables properly injected"
echo "========================================"

# Create runtime-env.js to expose environment variables to the browser
echo "Creating runtime-env.js file..."
cat > ./public/runtime-env.js << EOL
window.ENV_NODE_ENV = "${NODE_ENV}";
window.ENV_REACT_APP_API_URL = "${REACT_APP_API_URL}";
window.ENV_REACT_APP_CLIENT_URL = "${REACT_APP_CLIENT_URL}";
window.ENV_REACT_APP_SOCKET_URL = "${REACT_APP_SOCKET_URL}";
console.log('Runtime environment variables loaded');
EOL

# Show the environment variables being used for the build
echo ""
echo "Using environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "REACT_APP_API_URL: $REACT_APP_API_URL"
echo "REACT_APP_CLIENT_URL: $REACT_APP_CLIENT_URL"
echo "REACT_APP_SOCKET_URL: $REACT_APP_SOCKET_URL"

# Modify index.html to include the runtime-env.js script
echo ""
echo "Updating index.html to include runtime-env.js..."
sed -i 's/<head>/<head>\n    <script src="%PUBLIC_URL%\/runtime-env.js"><\/script>/g' ./public/index.html

# Run the standard build command
echo ""
echo "Running npm build command..."
npm run build

echo ""
echo "Build completed with runtime environment variables injected."
echo "========================================"
