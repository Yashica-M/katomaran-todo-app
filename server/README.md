# ToDo App Backend

This is the backend server for the ToDo application with Google OAuth authentication.

## Setup Google OAuth

To set up Google Sign-In for your application:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth Client ID"
5. Configure the OAuth consent screen:
   - Add your app name and user support email
   - Add your domain to the "Authorized domains" list
   - Save and continue
6. Create OAuth credentials:
   - Application type: Web application
   - Name: Your app name
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback` (for development)
   - Click "Create"
7. Google will provide a Client ID and Client Secret - copy these values

## Environment Variables

Create a `.env` file in the server directory with the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_secure_session_secret
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id_from_step_7
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_step_7
```

## Running the Server

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. The server will run at `http://localhost:5000`

## API Routes

### Authentication

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user info (requires authentication)
- `GET /api/auth/logout` - Logout current user
- `POST /api/auth/verify-token` - Verify JWT token validity

### Todos

- `GET /api/todos` - Get all todos for current user (requires authentication)
- `GET /api/todos/filter` - Get filtered todos (requires authentication)
- `GET /api/todos/:id` - Get a specific todo (requires authentication)
- `POST /api/todos` - Create a new todo (requires authentication)
- `PUT /api/todos/:id` - Update a todo (requires authentication)
- `DELETE /api/todos/:id` - Delete a todo (requires authentication)
- `POST /api/todos/:id/share` - Share a todo with another user (requires authentication)
