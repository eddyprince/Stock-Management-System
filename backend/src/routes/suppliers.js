/**
 * Suppliers CRUD — who products are from. Stock Manager and Admin can manage.
 */
import express from 'express';
import Supplier from '../models/Supplier.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const list = await Supplier.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, requireRole('stock_manager', 'admin'), async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Supplier name required' });
    const supplier = new Supplier({ name: name.trim(), contact: contact || '', address: address || '' });
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, requireRole('stock_manager', 'admin'), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
