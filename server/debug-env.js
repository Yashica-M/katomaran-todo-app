const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Check if .env file exists
const envPath = path.resolve(__dirname, '.env');
console.log(`Checking for .env file at: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath)}`);

// Load environment variables
console.log('Loading environment variables...');
dotenv.config();

// Check for environment variables
console.log('Environment variables loaded:');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

if (process.env.GOOGLE_CLIENT_ID) {
    // Only show first few characters for security
    const maskedID = process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...' + 
                     process.env.GOOGLE_CLIENT_ID.substring(process.env.GOOGLE_CLIENT_ID.length - 5);
    console.log('GOOGLE_CLIENT_ID:', maskedID);
}

if (process.env.GOOGLE_CLIENT_SECRET) {
    const maskedSecret = process.env.GOOGLE_CLIENT_SECRET.substring(0, 3) + '...' + 
                         process.env.GOOGLE_CLIENT_SECRET.substring(process.env.GOOGLE_CLIENT_SECRET.length - 3);
    console.log('GOOGLE_CLIENT_SECRET:', maskedSecret);
}

console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Try reading the .env file directly
try {
    console.log('\nReading .env file contents:');
    const envFileContent = fs.readFileSync(envPath, 'utf8');
    console.log(envFileContent.replace(/=.+/g, '=VALUE_HIDDEN'));
} catch (error) {
    console.error('Error reading .env file:', error.message);
}

console.log('\nNode version:', process.version);
console.log('Current working directory:', process.cwd());
