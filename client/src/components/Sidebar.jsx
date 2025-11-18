import React from 'react';

const Sidebar = ({ users, username, isConnected, selectedUser, setSelectedUser, typingUsers, messages, setSearchTerm }) => {
  return (
    <div className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="p-4 border-b bg-indigo-600 text-white">
        <h2 className="font-bold text-lg">Active Users ({users.length})</h2>
        <div className="flex items-center text-sm mt-1">
          <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Global Chat Button */}
        <div 
          onClick={() => { setSelectedUser(null); setSearchTerm(""); }}
          className={`p-3 rounded cursor-pointer flex items-center space-x-2 ${!selectedUser ? 'bg-indigo-100 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
        >
          <div className="h-8 w-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">#</div>
          <span className="font-medium text-gray-700">Global Chat</span>
        </div>

        <p className="text-xs font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider">Direct Messages</p>
        
        {/* User List */}
        {users.filter(u => u.username !== username).map((user) => {
           // Logic to check for unread messages
           const hasNewMessage = messages.length > 0 && 
                      messages[messages.length - 1].senderId === user.id && 
                      messages[messages.length - 1].isPrivate &&
                      selectedUser?.id !== user.id;

          return (
            <div 
              key={user.id} 
              onClick={() => { setSelectedUser(user); setSearchTerm(""); }}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer relative ${selectedUser?.id === user.id ? 'bg-indigo-50 border-l-4 border-indigo-400' : 'hover:bg-gray-50'}`}
            >
              <div className="relative">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <span className={`font-medium ${hasNewMessage ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{user.username}</span>
              {typingUsers.includes(user.username) && <span className="text-xs text-green-500 animate-pulse ml-auto">typing...</span>}
              {hasNewMessage && <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">1</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;