const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const phcRoutes = require('./routes/phc');
const patientRoutes = require('./routes/patient');
const ussdRoutes = require('./routes/ussd');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const notificationRoutes = require('./routes/notifications');
const { initDatabase } = require('./utils/database');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO real-time events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  socket.on('patient-update', (data) => {
    socket.to('staff-room').emit('patient-data-updated', data);
  });
  
  socket.on('staff-update', (data) => {
    socket.to(`patient-${data.patientId}`).emit('staff-data-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/phc', phcRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/voice', notificationRoutes);
app.use('/api/sync', require('./routes/sync'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'IlerAI Backend is running' });
});

// Initialize database and start server
initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 IlerAI Backend running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔄 Socket.IO enabled for real-time sync`);
    console.log(`\n✅ Authentication: No verification required`);
    console.log(`- Staff: Register/Login directly`);
    console.log(`- Patient: Register/Login directly`);
    console.log(`\n===========================================\n`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});