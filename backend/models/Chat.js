const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim: true
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure that group chats have a chatName
chatSchema.pre('save', function(next) {
  if (this.isGroupChat && !this.chatName) {
    return next(new Error('Group chat must have a name'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);