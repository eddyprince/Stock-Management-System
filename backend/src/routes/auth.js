/**
 * Auth routes: login and register (account creation).
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register (account creation) — self-register with role 'account'
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'account', email } = req.body;
    const name = (username != null && String(username).trim()) ? String(username).trim() : '';
    if (!name || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const existing = await User.findOne({ username: name });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists. Choose another or sign in.' });
    }
    const user = new User({
      username: name,
      password: String(password),
      role: role || 'account',
      email: (email != null ? String(email).trim() : '') || '',
    });
    await user.save();
    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'Validation failed' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists. Choose another or sign in.' });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed. Try again or use a different username.' });
  }
});

// Get current user (protected)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Update own profile (email, displayName)
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { email, displayName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(email !== undefined && { email: String(email).trim() }),
        ...(displayName !== undefined && { displayName: String(displayName).trim() }),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Update failed' });
  }
});

// Change own password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password required' });
    }
    if (newPassword.length < 3) {
      return res.status(400).json({ message: 'New password must be at least 3 characters' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Change password failed' });
  }
});

export default router;
