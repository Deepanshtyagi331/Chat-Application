const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  // Exclude current user and admins if needed
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json({
    success: true,
    users
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.status = req.body.status || user.status;
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        status: updatedUser.status,
        lastSeen: updatedUser.lastSeen
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus
};