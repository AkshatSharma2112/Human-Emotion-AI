// backend/src/server.js
const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO setup (optional - uncomment if needed)
// const socketIo = require('socket.io');
// const io = socketIo(server, {
//     cors: {
//         origin: ['http://localhost:5173', 'http://localhost:3000'],
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });

// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

server.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/overview`);
    console.log(`🧠 Personality API: http://localhost:${PORT}/api/personality/traits`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
    console.log(`😊 Emotion API: http://localhost:${PORT}/api/analyze`);
});