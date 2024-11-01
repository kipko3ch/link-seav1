const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { register, login, requestPasswordReset, resetPassword, updateProfile, updatePassword } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes - require authentication
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

module.exports = router; 