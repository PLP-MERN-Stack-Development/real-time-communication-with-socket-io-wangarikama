const { users, messages, typingUsers } = require('../models/store');

// Handle User Join
const handleUserJoin = (io, socket, username) => {
  users[socket.id] = { username, id: socket.id };
  
  // Notify everyone
  io.emit('user_list', Object.values(users));
  io.emit('user_joined', { username, id: socket.id });
  
  console.log(`User connected: ${username} (${socket.id})`);
};

// Handle Public Message
const handleSendMessage = (io, socket, messageData) => {
  const message = {
    ...messageData,
    id: Date.now(),
    sender: users[socket.id]?.username || 'Anonymous',
    senderId: socket.id,
    timestamp: new Date().toISOString(),
    isPrivate: false,
  };
  
  messages.push(message);
  
  // Keep only last 100 messages
  if (messages.length > 100) messages.shift();
  
  io.emit('receive_message', message);
};

// Handle Private Message
const handlePrivateMessage = (io, socket, { to, message }) => {
  const messageData = {
    id: Date.now(),
    sender: users[socket.id]?.username || 'Anonymous',
    senderId: socket.id,
    message,
    timestamp: new Date().toISOString(),
    isPrivate: true,
  };
  
  // Send to specific user (to) AND the sender (socket.id)
  io.to(to).emit('private_message', messageData);
  socket.emit('private_message', messageData);
  
  // Store in history so it persists on reload (optional, but good for UX)
  messages.push(messageData);
};

// Handle Typing
const handleTyping = (io, socket, isTyping) => {
  if (users[socket.id]) {
    const username = users[socket.id].username;
    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }
    io.emit('typing_users', Object.values(typingUsers));
  }
};

// Handle Disconnect
const handleDisconnect = (io, socket) => {
  if (users[socket.id]) {
    const { username } = users[socket.id];
    io.emit('user_left', { username, id: socket.id });
    console.log(`User disconnected: ${username}`);
  }
  
  delete users[socket.id];
  delete typingUsers[socket.id];
  
  io.emit('user_list', Object.values(users));
  io.emit('typing_users', Object.values(typingUsers));
};

module.exports = {
  handleUserJoin,
  handleSendMessage,
  handlePrivateMessage,
  handleTyping,
  handleDisconnect
};