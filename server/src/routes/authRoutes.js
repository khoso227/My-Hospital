const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', loginUser);

// @route   GET /api/auth
// @desc    Get all users (admin only)
router.get('/', protect, admin, getUsers);

module.exports = router;