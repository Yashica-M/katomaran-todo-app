# ToDo App

A simple and intuitive Todo application built with React (frontend) and Node.js (backend).

## Features

- Create, update, and delete tasks
- Mark tasks as completed
- Filter tasks by status (All, Active, Completed)
- Clean and simple user interface

## Project Structure

- `/client` - React frontend
- `/server` - Node.js backend

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Running the Client

```bash
cd client
npm install
npm start
```

The client will run on http://localhost:3000

### Running the Server

```bash
cd server
npm install
npm start
```

The server will run on http://localhost:5000

## Technologies Used

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (requires connection string in server/.env)

## Architecture

The application follows a client-server architecture:
- React frontend communicates with the Node.js backend via HTTP requests
- Backend connects to MongoDB Atlas for data storage
- Authentication is handled via JWT tokens

🚀 Features

- Google OAuth 2.0 login using Passport.js
- JWT-based authentication and session management
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


