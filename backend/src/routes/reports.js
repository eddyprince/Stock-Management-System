/**
 * Reports for Director and Admin: expired stock, in stock, out of stock, damaged, totals.
 */
import express from 'express';
import PDFDocument from 'pdfkit';
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

// PDF reports: /api/reports/pdf?type=summary|expired|damaged|stock
router.get('/pdf', authenticate, requireRole('director', 'admin'), async (req, res) => {
  try {
    const { type = 'summary' } = req.query;
    const products = await Product.find().populate('supplierId', 'name');
    const now = new Date();

    const doc = new PDFDocument({ margin: 36 });
    const safeType = String(type);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="stock-report-${safeType}.pdf"`);
    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Stock Management System – Report', { align: 'center' });
    doc.moveDown(0.25);
    doc.fontSize(10).text(`Type: ${safeType}`, { align: 'center' });
    doc.text(`Generated at: ${now.toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    const summary = {
      totalProducts: products.length,
      inStock: products.filter((p) => p.quantityInStock > 0).length,
      expired: products.filter((p) => p.expiryDate && p.expiryDate < now).length,
      damaged: products.filter((p) => (p.quantityDamaged || 0) > 0).length,
    };

    if (safeType === 'summary' || safeType === 'stock') {
      doc.fontSize(12).text('Stock summary', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Total products: ${summary.totalProducts}`);
      doc.text(`In stock items: ${summary.inStock}`);
      doc.text(`Expired products: ${summary.expired}`);
      doc.text(`Products with damage recorded: ${summary.damaged}`);
      doc.moveDown();
    }

    if (safeType === 'expired' || safeType === 'stock') {
      doc.moveDown(0.5);
      doc.fontSize(12).text('Expired items', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(9);
      products
        .filter((p) => p.expiryDate && p.expiryDate < now)
        .forEach((p) => {
          doc.text(
            `${p.name} | SKU: ${p.sku || '-'} | Qty: ${p.quantityInStock || 0} | Expiry: ${p.expiryDate?.toLocaleDateString()}`,
          );
        });
      if (!products.some((p) => p.expiryDate && p.expiryDate < now)) {
        doc.text('No expired items.');
      }
    }

    if (safeType === 'damaged' || safeType === 'stock') {
      doc.moveDown(0.75);
      doc.fontSize(12).text('Damaged items', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(9);
      products
        .filter((p) => (p.quantityDamaged || 0) > 0)
        .forEach((p) => {
          doc.text(`${p.name} | Damaged qty: ${p.quantityDamaged || 0}`);
        });
      if (!products.some((p) => (p.quantityDamaged || 0) > 0)) {
        doc.text('No damaged items.');
      }
    }

    doc.end();
  } catch (err) {
    console.error('Error generating PDF report:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message || 'Failed to generate PDF report' });
    }
  }
});

