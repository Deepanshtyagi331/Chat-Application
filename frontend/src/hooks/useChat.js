import { useState, useEffect, useRef } from 'react';
import socket from '../services/socket';
import axios from '../services/api';

export const useChat = (user) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    // Connect to socket
    if (!socket.connected) {
      socket.connect();
    }
    
    // Join user to socket
    if (user) {
      socket.emit('join', user._id);
    }
    
    // Listen for user status changes
    socket.on('user-status-changed', (data) => {
      setOnlineUsers(prev => {
        const newMap = new Map(prev);
        newMap.set(data.userId, {
          status: data.status,
          lastSeen: data.lastSeen
        });
        return newMap;
      });
    });
    
    // Listen for incoming calls
    socket.on('incoming-call', (callData) => {
      setIncomingCall(callData);
    });
    
    // Fetch chats when user changes
    const fetchChats = async () => {
      if (user) {
        try {
          const response = await axios.get('/chats');
          if (isMounted.current) {
            setChats(response.data.chats);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
    };
    
    fetchChats();
    
    // Cleanup
    return () => {
      isMounted.current = false;
      socket.off('user-status-changed');
      socket.off('incoming-call');
    };
  }, [user]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleCallUser = (userId, callType) => {
    // Implement call functionality
    console.log(`Calling user ${userId} with ${callType}`);
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      setActiveCall({
        ...incomingCall,
        status: 'active'
      });
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return {
    selectedChat,
    chats,
    setChats,
    onlineUsers,
    incomingCall,
    activeCall,
    handleSelectChat,
    handleCallUser,
    handleAcceptCall,
    handleRejectCall,
    handleEndCall
  };
};