const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../utils/auth');

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/logout').post(logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;