const Chat = require('../models/Chat');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create or access one-to-one chat
// @route   POST /api/chats
// @access  Private
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not sent with request');
  }

  // Check if chat already exists
  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  })
    .populate('users', '-password')
    .populate('latestMessage');

  if (chat) {
    res.status(200).json({
      success: true,
      chat
    });
  } else {
    // Create new chat
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId]
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      
      res.status(200).json({
        success: true,
        chat: fullChat
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        res.status(200).json({
          success: true,
          chats: results
        });
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400);
    throw new Error('Please provide group name and users');
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400);
    throw new Error('Group must have at least 2 users');
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      success: true,
      chat: fullGroupChat
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename group chat
// @route   PUT /api/chats/group/rename
// @access  Private
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json({
      success: true,
      chat: updatedChat
    });
  }
});

// @desc    Add user to group
// @route   PUT /api/chats/group/add
// @access  Private
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if user is already in the group
  const chat = await Chat.findById(chatId);
  if (chat.users.includes(userId)) {
    res.status(400);
    throw new Error('User already in group');
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json({
      success: true,
      chat: added
    });
  }
});

// @desc    Remove user from group
// @route   PUT /api/chats/group/remove
// @access  Private
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json({
      success: true,
      chat: removed
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};