import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../hooks/useChat';
import socket from '../services/socket';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import CallModal from '../components/CallModal';

const Chat = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    selectedChat,
    chats,
    setChats,
    onlineUsers,
    incomingCall,
    activeCall,
    handleSelectChat: selectChat,
    handleCallUser: callUser,
    handleAcceptCall: acceptCall,
    handleRejectCall: rejectCall,
    handleEndCall: endCall
  } = useChat(user);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
  };

  const handleSelectChat = (chat) => {
    selectChat(chat);
    // Close sidebar on mobile after selecting a chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleCallUser = (userId, callType) => {
    callUser(userId, callType);
  };

  const handleAcceptCall = () => {
    acceptCall();
  };

  const handleRejectCall = () => {
    rejectCall();
  };

  const handleEndCall = () => {
    endCall();
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden absolute top-3 left-3 z-10 p-2 rounded bg-white dark:bg-gray-800 shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      
      {/* Sidebar */}
      <div className={`absolute md:relative z-20 w-64 flex-shrink-0 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          user={user}
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onLogout={handleLogout}
          onToggleTheme={toggleTheme}
          theme={theme}
          onlineUsers={onlineUsers}
          onCallUser={handleCallUser}
        />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
        {selectedChat ? (
          <ChatArea 
            chat={selectedChat}
            currentUser={user}
            onlineUsers={onlineUsers}
            onCallUser={handleCallUser}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Welcome to Connectify</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a chat or start a new conversation
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setSidebarOpen(true);
                    setTimeout(() => {
                      document.querySelector('input[placeholder="Search users..."]')?.focus();
                    }, 300);
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Search Users
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Incoming Call Modal */}
      {incomingCall && (
        <CallModal
          callData={incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      
      {/* Active Call UI */}
      {activeCall && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Incoming {incomingCall?.callType} call</h3>
              <p className="text-gray-600 dark:text-gray-400">from {incomingCall?.callerName}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAcceptCall}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full"
              >
                Accept
              </button>
              <button
                onClick={handleRejectCall}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;