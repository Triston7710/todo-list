Todo List Full-Stack Application
A comprehensive full-stack Todo List application with authentication and real-time chat functionality.

Features
Task 1 - Frontend (React Todo List)
✅ Add, Edit, Delete, and Complete tasks
✅ Persist tasks using localStorage (with API fallback)
✅ Clean, responsive UI
✅ Uses useState and useEffect hooks
Task 2 - Backend CRUD API Endpoints
✅ GET /api/tasks - Get all tasks
✅ POST /api/tasks - Create task
✅ PUT /api/tasks/:id - Update task
✅ DELETE /api/tasks/:id - Delete task
✅ All endpoints are protected with JWT authentication
Task 3 - Authentication System
✅ POST /api/auth/register - User registration
✅ POST /api/auth/login - User login
✅ POST /api/auth/forgot-password - Request password reset
✅ POST /api/auth/reset-password - Reset password with token
✅ Hashed passwords using bcryptjs
✅ JWT sessions
✅ Email + password validation
✅ MongoDB database with Mongoose
Task 4 - Real-time Chatbot (Socket.io)
✅ Basic chat UI
✅ Frontend & backend connected via Socket.io
✅ Real-time messages
✅ Timestamps on all messages
Tech Stack
Frontend
React 18
Axios for API calls
Socket.io-client for real-time communication
CSS3 for styling
Backend
Node.js
Express.js
MongoDB with Mongoose
Socket.io
JWT for authentication
bcryptjs for password hashing
express-validator for input validation
nodemailer for email (password reset)
Installation
Prerequisites
Node.js (v14 or higher)
MongoDB (local or MongoDB Atlas)
npm or yarn
Setup Steps
Install root dependencies:
npm install
Install backend dependencies:
cd backend
npm install
Install frontend dependencies:
cd ../frontend
npm install
Configure environment variables:

Copy backend/.env.example to backend/.env
Update the values in backend/.env:
PORT=5000
MONGODB_URI=mongodb://localhost:5000/api/todolist
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
Start MongoDB:

Make sure MongoDB is running on your system
Or use MongoDB Atlas connection string in .env
Run the application:

From root directory: npm run dev (runs both frontend and backend)
Or separately:
Backend: cd backend && npm run dev
Frontend: cd frontend && npm start
API Endpoints
Features in Detail
Frontend
Responsive Design: Works on desktop, tablet, and mobile devices
Local Storage Backup: Tasks are saved to localStorage as a fallback if API fails
Real-time Updates: Chat messages appear instantly
Clean UI: Modern gradient design with smooth transitions
Backend
Secure Authentication: Passwords are hashed with bcryptjs
JWT Sessions: Secure token-based authentication
Input Validation: All inputs are validated using express-validator
Error Handling: Comprehensive error handling throughout
Real-time Communication: Socket.io for instant messaging
Development Notes
The frontend runs on http://localhost:3000
The backend runs on http://localhost:5000
MongoDB should be running on mongodb://localhost:5000 (or configure in .env)
Socket.io is configured to allow CORS from the frontend
