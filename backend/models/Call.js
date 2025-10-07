const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  callType: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  callStatus: {
    type: String,
    enum: ['missed', 'answered', 'rejected', 'ended'],
    default: 'missed'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Set end time before saving if call is ended
callSchema.pre('save', function(next) {
  if (this.callStatus === 'ended' && !this.endTime) {
    this.endTime = new Date();
    if (this.startTime) {
      this.duration = Math.floor((this.endTime - this.startTime) / 1000);
    }
  }
  next();
});

module.exports = mongoose.model('Call', callSchema);