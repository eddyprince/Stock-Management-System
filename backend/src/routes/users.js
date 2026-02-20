/**
 * User management — Admin only (list, create with role).
 */
import express from 'express';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { username, password, role = 'account', email } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    const existing = await User.findOne({ username: username.trim() });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    const user = new User({ username: username.trim(), password, role: role || 'account', email: email || '' });
    await user.save();
    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
