const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, messageType, fileUrl, fileName } = req.body;

  if (!content && !fileUrl) {
    res.status(400);
    throw new Error('Message content or file is required');
  }

  if (!chatId) {
    res.status(400);
    throw new Error('ChatId is required');
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    messageType: messageType || 'text',
    fileUrl: fileUrl || '',
    fileName: fileName || ''
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name avatar');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email status'
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id
    });

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get all messages in a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar email')
      .populate('chat');

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    // Add user to readBy array if not already there
    if (!message.readBy.includes(req.user._id)) {
      message.readBy.push(req.user._id);
      await message.save();
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  getAllMessages,
  markAsRead
};