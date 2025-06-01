require('dotenv').config();
const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ROUTE, // your frontend origin
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
