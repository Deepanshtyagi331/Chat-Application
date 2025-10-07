const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../utils/auth');

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, getAllMessages);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;