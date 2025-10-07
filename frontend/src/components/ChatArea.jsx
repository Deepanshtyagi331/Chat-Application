import React, { useState, useEffect, useRef } from 'react';
import axios from '../services/api';
import socket from '../services/socket';

const ChatArea = ({ chat, currentUser, onlineUsers, onCallUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Join chat room
    socket.emit('join-chat', chat._id);
    
    // Listen for new messages
    socket.on('message-received', (message) => {
      if (message.chat._id === chat._id) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    // Listen for typing indicators
    socket.on('user-typing', (data) => {
      if (data.chatId === chat._id && data.userId !== currentUser._id) {
        setIsTyping(data.isTyping);
      }
    });
    
    // Cleanup
    return () => {
      socket.emit('leave-chat', chat._id);
      socket.off('message-received');
      socket.off('user-typing');
    };
  }, [chat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/messages/${chat._id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      // Emit stop typing
      socket.emit('typing', {
        chatId: chat._id,
        userId: currentUser._id,
        isTyping: false
      });
      
      const response = await axios.post('/messages', {
        content: newMessage,
        chatId: chat._id
      });
      
      // Emit new message to other users
      socket.emit('new-message', response.data.message);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    // Emit typing indicator
    socket.emit('typing', {
      chatId: chat._id,
      userId: currentUser._id,
      isTyping: true
    });
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        chatId: chat._id,
        userId: currentUser._id,
        isTyping: false
      });
    }, 1000);
  };

  const getOtherUser = () => {
    if (chat.isGroupChat) return null;
    return chat.users.find(user => user._id !== currentUser._id);
  };

  const otherUser = getOtherUser();
  const isOnline = otherUser ? onlineUsers.get(otherUser._id)?.status === 'online' : false;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {chat.isGroupChat
                  ? chat.chatName.charAt(0).toUpperCase()
                  : otherUser?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {chat.isGroupChat ? chat.chatName : otherUser?.name}
              </h3>
              {!chat.isGroupChat && (
                <div className="flex items-center">
                  <div className={`h-1.5 w-1.5 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            {!chat.isGroupChat && (
              <>
                <button
                  onClick={() => onCallUser(otherUser._id, 'audio')}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onCallUser(otherUser._id, 'video')}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 bg-white dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-1.5 text-sm rounded-lg ${
                    message.sender._id === currentUser._id
                      ? 'bg-gray-800 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${message.sender._id === currentUser._id ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={sendMessage} className="flex items-center">
          <div className="flex-1 mr-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Type a message..."
              className="block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-1.5 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;