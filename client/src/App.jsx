import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from './socket/socket';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  } = useSocket();

  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // EFFECT: Auto-scroll
  useEffect(() => {
    if (!searchTerm) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser, searchTerm]);

  // EFFECT: Notifications
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender !== username) {
        notificationSound.current.play().catch(err => console.log("Audio blocked:", err));
        const originalTitle = document.title;
        document.title = `New Message from ${lastMsg.sender}!`;
        setTimeout(() => { document.title = "Socket.io Chat"; }, 3000);
      }
    }
  }, [messages, username]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (selectedUser) {
        sendPrivateMessage(selectedUser.id, inputValue);
      } else {
        sendMessage(inputValue);
      }
      setInputValue('');
      handleTyping(false);
    }
  };

  const handleTyping = (isTyping) => {
    setTyping(isTyping);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
    }
  };

  // Filter Logic
  const filteredMessages = messages.filter((msg) => {
    let matchesRoom = false;
    if (msg.system) {
      matchesRoom = true;
    } else if (selectedUser) {
      matchesRoom = (msg.isPrivate && (msg.senderId === selectedUser.id || msg.sender === username));
    } else {
      matchesRoom = !msg.isPrivate;
    }
    const matchesSearch = msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoom && matchesSearch;
  });

  // --- MAIN RENDER ---
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} username={username} setUsername={setUsername} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        users={users} 
        username={username} 
        isConnected={isConnected}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        typingUsers={typingUsers}
        messages={messages}
        setSearchTerm={setSearchTerm}
      />

      <ChatWindow 
        selectedUser={selectedUser}
        username={username}
        filteredMessages={filteredMessages}
        messagesEndRef={messagesEndRef}
        typingUsers={typingUsers}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}

export default App;