const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateName, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/name', authMiddleware, updateName);
router.put('/profile/password', authMiddleware, updatePassword);

module.exports = router;
