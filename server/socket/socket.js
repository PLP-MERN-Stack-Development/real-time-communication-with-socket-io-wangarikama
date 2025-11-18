const { Server } = require('socket.io');
const chatController = require('../controllers/chatController');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      // Allow connections from your React client
      origin: [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5175"
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Map events to controller functions
    
    socket.on('user_join', (username) => {
      chatController.handleUserJoin(io, socket, username);
    });

    socket.on('send_message', (data) => {
      chatController.handleSendMessage(io, socket, data);
    });

    socket.on('private_message', (data) => {
      chatController.handlePrivateMessage(io, socket, data);
    });

    socket.on('typing', (isTyping) => {
      chatController.handleTyping(io, socket, isTyping);
    });

    socket.on('disconnect', () => {
      chatController.handleDisconnect(io, socket);
    });
  });

  return io;
};

module.exports = initializeSocket;