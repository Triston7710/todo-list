const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/auth', require('./routes/auth'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join('chat-room');
    socket.broadcast.emit('user-joined', userId);
  });

  socket.on('send-message', (data) => {
    const messageData = {
      ...data,
      socketId: socket.id, // Include socket ID to identify sender
      timestamp: new Date().toISOString()
    };
    // Broadcast to all except sender (sender already sees their message)
    socket.to('chat-room').emit('receive-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:5000/api/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };


