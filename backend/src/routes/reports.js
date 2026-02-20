/**
 * Reports for Director and Admin: expired stock, in stock, out of stock, damaged, totals.
 */
import express from 'express';
import Product from '../models/Product.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, requireRole('director', 'admin'), async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId', 'name');
    const now = new Date();
    const report = {
      summary: {
        totalProducts: products.length,
        inStock: products.filter((p) => p.quantityInStock > 0).length,
        outOfStock: products.filter((p) => p.quantityInStock === 0 && (p.quantityOutOfStock > 0 || p.quantityDamaged >= 0)).length,
        expired: products.filter((p) => p.expiryDate && p.expiryDate < now).length,
        totalQuantityInStock: products.reduce((s, p) => s + (p.quantityInStock || 0), 0),
        totalQuantityDamaged: products.reduce((s, p) => s + (p.quantityDamaged || 0), 0),
        totalSuppliedAll: products.reduce((s, p) => s + (p.totalSupplied || 0), 0),
      },
      expiredItems: products
        .filter((p) => p.expiryDate && p.expiryDate < now)
        .map((p) => ({
          _id: p._id,
          name: p.name,
          sku: p.sku,
          quantityInStock: p.quantityInStock,
          expiryDate: p.expiryDate,
          supplierName: p.supplierName || (p.supplierId && p.supplierId.name),
        })),
      inStockItems: products.filter((p) => p.quantityInStock > 0).map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        quantityInStock: p.quantityInStock,
        totalSupplied: p.totalSupplied,
        supplierName: p.supplierName || (p.supplierId && p.supplierId.name),
      })),
      damagedSummary: products
        .filter((p) => (p.quantityDamaged || 0) > 0)
        .map((p) => ({
          _id: p._id,
          name: p.name,
          quantityDamaged: p.quantityDamaged,
        })),
    };
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
