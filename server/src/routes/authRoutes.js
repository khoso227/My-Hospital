const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Agar aapne protect aur admin middleware use karne hain to line niche rakhein
// const { protect, admin } = require('../middlewares/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   POST /api/auth/recover
router.post('/recover', authController.recoverPassword);

// @route   GET /api/auth (Admin Only - Users list dekhne ke liye)
// router.get('/', protect, admin, authController.getUsers); 

module.exports = router;