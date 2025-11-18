const users = {};       // Stores active users: { socketId: { username, id } }
const messages = [];    // Stores chat history
const typingUsers = {}; // Stores who is currently typing

module.exports = {
  users,
  messages,
  typingUsers
};