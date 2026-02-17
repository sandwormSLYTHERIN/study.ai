const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private (requires JWT token)
 */
router.get('/me', protect, getMe);

module.exports = router;

/*
What this does:

Defines 3 routes:

POST /api/auth/register - Anyone can register
POST /api/auth/login - Anyone can login
GET /api/auth/me - Only authenticated users (requires token)


The protect middleware checks JWT before allowing access to /me
*/