/**
 * User management — Admin only (list, create with role).
 */
import express from 'express';
import User from '../models/User.js';
import UserArchive from '../models/UserArchive.js';
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

// Update user (admin) – change role, email or username
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, email } = req.body;
    const update = {};
    if (username !== undefined) update.username = String(username).trim();
    if (role !== undefined) update.role = role;
    if (email !== undefined) update.email = String(email).trim();
    update.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (admin) – move to archive collection before removal
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent admin from deleting themselves accidentally
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    // Archive copy
    await UserArchive.create({
      originalUserId: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      archivedBy: req.user._id,
    });

    await user.deleteOne();
    res.json({ message: 'User deleted and moved to archive.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
