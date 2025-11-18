import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ 
  selectedUser, 
  username, 
  filteredMessages, 
  messagesEndRef, 
  typingUsers, 
  inputValue, 
  setInputValue, 
  handleSendMessage, 
  handleTyping,
  searchTerm,
  setSearchTerm 
}) => {
  
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header & Search */}
      <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            {selectedUser ? `💬 ${selectedUser.username}` : '🌐 Global Chat Room'}
          </h3>
          <p className="text-xs text-gray-500">
            {selectedUser ? 'Private Message' : 'Visible to everyone'}
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm px-2 w-24 md:w-48 focus:outline-none"
          />
        </div>

        <button onClick={() => window.location.reload()} className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
          Logout
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {filteredMessages.length === 0 && searchTerm && (
           <div className="text-center text-gray-400 mt-10">No messages found matching "{searchTerm}"</div>
        )}
        
        {filteredMessages.map((msg, index) => {
          if (msg.system) {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{msg.message}</span>
              </div>
            );
          }
          const isMe = msg.sender === username;
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                isMe 
                  ? (msg.isPrivate ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white') 
                  : 'bg-white text-gray-800 border'
              }`}>
                {!isMe && <div className={`text-xs font-bold mb-1 ${msg.isPrivate ? 'text-rose-500' : 'text-indigo-500'}`}>{msg.sender}</div>}
                <p>{msg.message}</p>
                <div className={`text-xs mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {msg.isPrivate && <span className="ml-2 opacity-75">🔒 Private</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div className="px-4 h-6 text-sm text-gray-500 italic">
        {typingUsers.length > 0 && (
          <p>{typingUsers.filter(u => u !== username).join(', ')} is typing...</p>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); handleTyping(true); }}
          placeholder={selectedUser ? `Message ${selectedUser.username}...` : "Type a public message..."}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
        />
        <button type="submit" disabled={!inputValue.trim()} className={`rounded-full p-2 w-10 h-10 flex items-center justify-center text-white transition disabled:opacity-50 ${selectedUser ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;