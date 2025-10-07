const User = require('../models/User');
const Message = require('../models/Message');
const Call = require('../models/Call');

// Store connected users
const connectedUsers = new Map();

const socketHandler = (socket, io) => {
  // User joins the application
  socket.on('join', async (userId) => {
    try {
      // Store user socket connection
      connectedUsers.set(userId, socket.id);
      
      // Update user status to online
      const user = await User.findById(userId);
      if (user) {
        user.status = 'online';
        await user.save();
        
        // Emit user status update to all connected clients
        socket.broadcast.emit('user-status-changed', {
          userId,
          status: 'online'
        });
      }
      
      console.log(`User ${userId} connected with socket ${socket.id}`);
    } catch (error) {
      console.error('Error in join event:', error);
    }
  });

  // User disconnects
  socket.on('disconnect', async () => {
    try {
      // Find user by socket id and update status
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          
          // Update user status to offline
          const user = await User.findById(userId);
          if (user) {
            user.status = 'offline';
            await user.updateLastSeen();
            
            // Emit user status update to all connected clients
            socket.broadcast.emit('user-status-changed', {
              userId,
              status: 'offline',
              lastSeen: user.lastSeen
            });
          }
          
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    } catch (error) {
      console.error('Error in disconnect event:', error);
    }
  });

  // Join a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat ${chatId}`);
  });

  // Send new message
  socket.on('new-message', async (messageData) => {
    try {
      // Emit message to all users in the chat room except sender
      socket.to(messageData.chatId).emit('message-received', messageData);
      
      console.log('Message sent:', messageData);
    } catch (error) {
      console.error('Error in new-message event:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user-typing', {
      userId: data.userId,
      chatId: data.chatId,
      isTyping: data.isTyping
    });
  });

  // Message read receipt
  socket.on('message-read', (data) => {
    socket.to(data.chatId).emit('message-read-receipt', {
      messageId: data.messageId,
      userId: data.userId,
      readBy: data.readBy
    });
  });

  // Call events
  // Outgoing call
  socket.on('outgoing-call', (callData) => {
    const { callerId, receiverId, callType } = callData;
    
    // Get receiver's socket id
    const receiverSocketId = connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      // Emit incoming call to receiver
      io.to(receiverSocketId).emit('incoming-call', {
        callerId,
        callType,
        signalData: callData.signalData
      });
    }
  });

  // Answer call
  socket.on('answer-call', (callData) => {
    const { callerId, receiverId, signalData } = callData;
    
    // Get caller's socket id
    const callerSocketId = connectedUsers.get(callerId);
    
    if (callerSocketId) {
      // Emit call answered to caller
      io.to(callerSocketId).emit('call-answered', {
        receiverId,
        signalData
      });
    }
  });

  // Reject call
  socket.on('reject-call', (callData) => {
    const { callerId, receiverId } = callData;
    
    // Get caller's socket id
    const callerSocketId = connectedUsers.get(callerId);
    
    if (callerSocketId) {
      // Emit call rejected to caller
      io.to(callerSocketId).emit('call-rejected', {
        receiverId
      });
    }
  });

  // End call
  socket.on('end-call', (callData) => {
    const { callerId, receiverId } = callData;
    
    // Get receiver's socket id
    const receiverSocketId = connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      // Emit call ended to receiver
      io.to(receiverSocketId).emit('call-ended');
    }
  });

  // ICE candidate
  socket.on('ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
    
    // Get target user's socket id
    const targetSocketId = connectedUsers.get(targetUserId);
    
    if (targetSocketId) {
      // Emit ICE candidate to target user
      io.to(targetSocketId).emit('ice-candidate', candidate);
    }
  });
};

module.exports = socketHandler;