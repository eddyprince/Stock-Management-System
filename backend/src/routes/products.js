/**
 * Products and stock CRUD. Stock Manager and Admin can create/update;
 * all authenticated can read. Products store supplier (where from) and totalSupplied.
 */
import express from 'express';
import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// List all products (with optional filters: expired, in_stock, out_of_stock)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, expired } = req.query;
    const filter = {};
    if (status === 'in_stock') filter.quantityInStock = { $gt: 0 };
    if (status === 'out_of_stock') {
      filter.$or = [{ quantityInStock: 0 }, { quantityOutOfStock: { $gt: 0 } }];
    }
    if (expired === 'true') filter.expiryDate = { $lt: new Date() };
    const products = await Product.find(filter).populate('supplierId', 'name contact').sort({ updatedAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one product
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'name contact');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product (stock_manager, admin) — record supplier and total supplied
router.post('/', authenticate, requireRole('stock_manager', 'admin'), async (req, res) => {
  try {
    const {
      name,
      sku,
      quantityInStock,
      quantityOutOfStock,
      quantityDamaged,
      totalSupplied,
      supplierId,
      supplierName,
      expiryDate,
      unitPrice,
    } = req.body;
    if (!name) return res.status(400).json({ message: 'Product name required' });
    const product = new Product({
      name,
      sku: sku || undefined,
      quantityInStock: Number(quantityInStock) || 0,
      quantityOutOfStock: Number(quantityOutOfStock) || 0,
      quantityDamaged: Number(quantityDamaged) || 0,
      totalSupplied: Number(totalSupplied) || 0,
      supplierId: supplierId || undefined,
      supplierName: supplierName || undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      unitPrice: unitPrice != null ? Number(unitPrice) : undefined,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', authenticate, requireRole('stock_manager', 'admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Record stock movement (in/out/damaged) — updates product qty and totalSupplied if type is 'in'
router.post('/:id/transaction', authenticate, requireRole('stock_manager', 'admin'), async (req, res) => {
  try {
    const { type, quantity, amount, note } = req.body;
    if (!['in', 'out', 'damaged', 'adjustment'].includes(type) || quantity == null) {
      return res.status(400).json({ message: 'Valid type and quantity required' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const q = Number(quantity);
    if (type === 'in') {
      product.quantityInStock += q;
      product.totalSupplied += q;
    } else if (type === 'out') {
      product.quantityInStock = Math.max(0, product.quantityInStock - q);
      product.quantityOutOfStock += q;
    } else if (type === 'damaged') {
      product.quantityInStock = Math.max(0, product.quantityInStock - q);
      product.quantityDamaged += q;
    }
    product.updatedAt = new Date();
    await product.save();
    const tx = new StockTransaction({
      productId: product._id,
      type,
      quantity: q,
      amount: amount != null ? Number(amount) : undefined,
      userId: req.user._id,
      note,
    });
    await tx.save();
    res.status(201).json({ product, transaction: tx });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
