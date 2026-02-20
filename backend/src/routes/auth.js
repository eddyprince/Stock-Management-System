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

// Register (account creation) — only admin can create other users, or allow self-register with role 'account'
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'account', email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const existing = await User.findOne({ username: username.trim() });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    const user = new User({
      username: username.trim(),
      password,
      role: role || 'account',
      email: email || '',
    });
    await user.save();
    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user (protected)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
