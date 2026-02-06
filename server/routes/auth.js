const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT (with dev fallback secret)
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for email OR username
    const user = await User.findOne({ 
      $or: [
        { email: email }, 
        { username: email }
      ] 
    }).populate('assignedStore');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedStore: user.assignedStore,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Verify password
// @route   POST /api/auth/verify-password
// @access  Private
router.post('/verify-password', protect, async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ success: true });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

module.exports = router;
