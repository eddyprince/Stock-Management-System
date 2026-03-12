import express from 'express';
import Client from '../models/Client.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

function isValidPhone(phone) {
  if (!phone) return true;
  const trimmed = String(phone).trim();
  return /^07(2|3|8|9)\d{7}$/.test(trimmed);
}

function isValidTin(tin) {
  if (!tin) return false;
  const trimmed = String(tin).trim();
  return /^1\d{8}$/.test(trimmed);
}

// List clients (admin, stock manager, accountant)
router.get('/', authenticate, requireRole('admin', 'stock_manager', 'account'), async (req, res) => {
  try {
    const clients = await Client.find().sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load clients' });
  }
});

// Create client
router.post('/', authenticate, requireRole('admin', 'stock_manager', 'account'), async (req, res) => {
  try {
    const { name, tin, phone, address, fax } = req.body;
    if (!name || !tin) {
      return res.status(400).json({ message: 'Client name and TIN / number are required.' });
    }
    if (!isValidTin(tin)) {
      return res.status(400).json({ message: 'TIN must start with 1 and have exactly 9 digits.' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: 'Phone must start with 078/072/079/073 and have exactly 10 digits.',
      });
    }
    const existing = await Client.findOne({ tin: String(tin).trim() });
    if (existing) {
      return res.status(400).json({ message: 'A client with this TIN already exists. Select it instead.' });
    }
    const client = await Client.create({
      name: String(name).trim(),
      tin: String(tin).trim(),
      phone: phone || '',
      address: address || '',
      fax: fax || '',
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create client' });
  }
});

// Update client (admin only)
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tin, phone, address, fax } = req.body;
    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (tin !== undefined) {
      if (!isValidTin(tin)) {
        return res
          .status(400)
          .json({ message: 'TIN must start with 1 and have exactly 9 digits.' });
      }
      update.tin = String(tin).trim();
    }
    if (phone !== undefined) {
      if (!isValidPhone(phone)) {
        return res.status(400).json({
          message: 'Phone must start with 078/072/079/073 and have exactly 10 digits.',
        });
      }
      update.phone = phone;
    }
    if (address !== undefined) update.address = address;
    if (fax !== undefined) update.fax = fax;
    update.updatedAt = new Date();
    const client = await Client.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update client' });
  }
});

// Delete client (admin only)
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete client' });
  }
});

export default router;

