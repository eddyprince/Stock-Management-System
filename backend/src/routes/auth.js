/**
 * Auth routes: login and register (account creation).
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { sendVerificationEmail, sendResetEmail } from '../utils/email.js';

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
    if (!user.verified) {
      return res.status(403).json({ message: 'Account not verified yet. Please complete verification before logging in.' });
    }
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

// Register (account creation) — self-register with selected role (except admin)
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
    // Only allow safe roles to be chosen at signup (no admin)
    const allowedRoles = ['account', 'stock_manager', 'director'];
    const safeRole = allowedRoles.includes(role) ? role : 'account';
    // Simulate email verification with a random numeric code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      username: name,
      password: String(password),
      role: safeRole,
      email: (email != null ? String(email).trim() : '') || '',
      verificationCode,
    });
    await user.save();
    console.log(`Verification code for ${user.username} (simulated email): ${verificationCode}`);
    // Try to send real email if SMTP is configured
    try {
      if (user.email && process.env.SMTP_HOST) {
        await sendVerificationEmail(user.email, user.username, verificationCode);
      }
    } catch (e) {
      console.warn('Failed to send verification email:', e.message);
    }
    res.status(201).json({
      user: user.toJSON(),
      verificationCode, // in a real app this would only be emailed; here we expose it for demonstration
    });
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

// Verify registration code
router.post('/verify-code', async (req, res) => {
  try {
    const { username, code } = req.body;
    if (!username || !code) {
      return res.status(400).json({ message: 'Username and verification code required' });
    }
    const user = await User.findOne({ username: String(username).trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verified) {
      return res.status(200).json({ message: 'Account already verified' });
    }
    if (user.verificationCode !== String(code).trim()) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    user.verified = true;
    user.verificationCode = undefined;
    await user.save();
    res.json({ message: 'Account verified. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Verification failed' });
  }
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

// Request password reset (simulated email code)
router.post('/request-reset', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ message: 'Username and email required' });
    const user = await User.findOne({ username: String(username).trim(), email: String(email).trim() });
    if (!user) return res.status(404).json({ message: 'User with that username and email not found' });
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    await user.save();
    console.log(`Password reset code for ${user.username} (simulated email): ${resetCode}`);
    // Try to send real email if SMTP is configured
    try {
      if (user.email && process.env.SMTP_HOST) {
        await sendResetEmail(user.email, user.username, resetCode);
      }
    } catch (e) {
      console.warn('Failed to send reset email:', e.message);
    }
    res.json({ message: 'Reset code generated.', resetCode });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Request reset failed' });
  }
});

// Reset password using reset code
router.post('/reset-password', async (req, res) => {
  try {
    const { username, code, newPassword } = req.body;
    if (!username || !code || !newPassword) {
      return res.status(400).json({ message: 'Username, code and new password required' });
    }
    if (newPassword.length < 3) {
      return res.status(400).json({ message: 'New password must be at least 3 characters' });
    }
    const user = await User.findOne({ username: String(username).trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.resetCode !== String(code).trim()) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }
    user.password = newPassword;
    user.resetCode = undefined;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Password reset successful. You can now log in with the new password.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Reset password failed' });
  }
});

export default router;
