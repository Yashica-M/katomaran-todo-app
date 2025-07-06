# katomaran-todo-app
 Todo Task Management Web Application
 
 A full-stack Todo Task Management Web App built for the Katomaran Full Stack Hackathon. It allows users to log in with Google, manage personal and shared tasks, and receive real-time task updates. The project demonstrates full-stack engineering skills including OAuth authentication, REST APIs, WebSocket communication, and deployment.

🚀 Features

- Google OAuth 2.0 login using Passport.js
- Full CRUD operations on tasks
- Task sharing via email or username
- Real-time task updates using Socket.IO
- Task filters: due today, overdue, by priority and status
- Responsive design for desktop and mobile
- Toast notifications and error handling
- Pagination and sorting of tasks
- Rate limiting and input validation

⚙️ Tech Stack

- Frontend: React, Axios, React Router, Socket.IO Client, Toastify
- Backend: Node.js, Express, Mongoose, Passport.js, JWT, Socket.IO
- Database: MongoDB Atlas
- Authentication: Google OAuth 2.0
- Deployment:
  - Frontend: Vercel
  - Backend: Render / Railway
  - DB: MongoDB Atlas (Cloud-hosted)

🛠️ Setup Instructions

1. Clone the repository
```
git clone https://github.com/Yashica-M/katomaran-todo-app.git
cd katomaran-todo-app
```
2. Backend Setup (/server)
```
cd server
npm install
```

Create a .env file in /server with:
```
.env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
```
Start the server:
```
npm start
```

3. Frontend Setup (/client)
```
cd ../client
npm install
```

Create a .env file in /client with:
```
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:
```
npm start
```

🔐 How OAuth 2.0 Works
Users authenticate with their Google account via OAuth.

The backend receives the Google user info and creates a JWT token.

The frontend stores the JWT and uses it for authenticated API requests.

📦 How Task Management Works
Each user has their own task list stored in MongoDB.

Tasks include: title, description, dueDate, priority, status, sharedWith.

Users can create, update, delete, and share tasks with other registered users.

🔄 How Real-Time Updates Work
The backend uses Socket.IO to emit events like task-created, task-updated, etc.

The frontend listens to these events and refreshes the task list instantly for all users.

This enables collaborative task management in real-time.


Assumptions
Only Google login is implemented (not GitHub or Facebook)

Shared tasks are visible to invited users after accepting invitation (future improvement)

Minimal offline support — currently limited to viewing cached UI

Only basic priority/status fields are supported (e.g., Low/Medium/High, In Progress/Done)

🌐 Live Links
🔗 Frontend: https://your-frontend.vercel.app

🔗 Backend: https://your-backend.onrender.com

🎥 Loom Video Demo


🏗️ Architecture Diagram
```
                                     +----------------+
                                     |                |
                                     | MongoDB Atlas  |
                                     |                |
                                     +--------^-------+
                                              |
                                              |
+-------------+                      +--------v-------+                  +----------------+
|             |        HTTP          |                |    OAuth 2.0     |                |
|  React      |<------------------->|  Node.js       |<---------------->|  Google Auth   |
|  Frontend   |                     |  Backend       |                  |  Service       |
|             |                     |                |                  |                |
+-------------+                     +----------------+                  +----------------+

Client (Vercel)                   Server (Render/Railway)
+-----------------------+         +-------------------------+
| - React Components    |         | - Express API           |
| - Context Providers   |         | - Mongoose Models       |
| - React Router        |         | - JWT Authentication    |
| - Simple CSS Styling  |         | - Input Validation      |
| - Toast Notifications |         |                         |
| - Basic Error Handling|         |                         |
+-----------------------+         +-------------------------+
```



This project is a part of a hackathon run by https://www.katomaran.com
