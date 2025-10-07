const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus
} = require('../controllers/userController');
const { protect } = require('../utils/auth');

router.route('/').get(protect, getAllUsers);
router.route('/:id').get(protect, getUserById);
router.route('/:id/status').put(protect, updateUserStatus);

module.exports = router;