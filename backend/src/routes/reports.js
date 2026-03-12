/**
 * Reports for Director and Admin: expired stock, in stock, out of stock, damaged, totals.
 */
import express from 'express';
import PDFDocument from 'pdfkit';
import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import Sale from '../models/Sale.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, requireRole('director', 'admin'), async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId', 'name');
    const now = new Date();
    // Use stock transactions to estimate sales and profit/loss
    const tx = await StockTransaction.find({
      type: { $in: ['out', 'damaged'] },
    })
      .populate('productId', 'name unitPrice')
      .populate('userId', 'username role');
    const salesTx = tx.filter((t) => t.type === 'out');
    const damagedTx = tx.filter((t) => t.type === 'damaged');
    const totalSalesQty = salesTx.reduce((s, t) => s + (t.quantity || 0), 0);
    const totalSalesAmount = salesTx.reduce(
      (s, t) => s + (t.amount != null ? t.amount : (t.productId?.unitPrice || 0) * (t.quantity || 0)),
      0,
    );
    const totalDamagedQty = damagedTx.reduce((s, t) => s + (t.quantity || 0), 0);
    const estimatedLoss = damagedTx.reduce(
      (s, t) => s + (t.productId?.unitPrice || 0) * (t.quantity || 0),
      0,
    );
    const estimatedProfit = totalSalesAmount - estimatedLoss;
    // Sales grouped by user (for director to see who sold what)
    const salesByUserMap = new Map();
    salesTx.forEach((t) => {
      if (!t.userId) return;
      const key = String(t.userId._id);
      const existing = salesByUserMap.get(key) || {
        userId: t.userId._id,
        username: t.userId.username,
        role: t.userId.role,
        totalSalesQty: 0,
        totalSalesAmount: 0,
      };
      existing.totalSalesQty += t.quantity || 0;
      existing.totalSalesAmount +=
        t.amount != null ? t.amount : (t.productId?.unitPrice || 0) * (t.quantity || 0);
      salesByUserMap.set(key, existing);
    });

    // Payment breakdown from sales collection (only non-refund sales)
    const payments = await Sale.aggregate([
      { $match: { isRefund: { $ne: true } } },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

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
      salesSummary: {
        totalSalesQty,
        totalSalesAmount,
        totalDamagedQty,
        estimatedLoss,
        estimatedProfit,
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
      salesByUser: Array.from(salesByUserMap.values()),
      paymentByMethod: payments.map((p) => ({
        method: p._id,
        totalAmount: p.totalAmount,
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
    const safeType = String(type);
    const products = await Product.find().populate('supplierId', 'name');
    const now = new Date();

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="stock-report-${safeType}.pdf"`);
    doc.pipe(res);

    // ===== Header: matches the clean report style =====
    const generatedBy = `${req.user?.username || 'system'} (${req.user?.role || 'role'})`;

    doc.fontSize(18).font('Helvetica-Bold').text('Stock Management System', { align: 'center' });
    doc.moveDown(0.5);

    let subtitle = 'Inventory Report';
    if (safeType === 'expired') subtitle = 'Expired Stock Report';
    else if (safeType === 'damaged') subtitle = 'Damaged Stock Report';
    else if (safeType === 'stock') subtitle = 'Full Stock Report';

    // Top meta row: date / subtitle / generated by
    doc.fontSize(10).font('Helvetica');
    const topY = doc.y;
    doc.text(`Date: ${now.toLocaleDateString()}`, 50, topY);
    doc.font('Helvetica-Bold').text(subtitle, 0, topY, { align: 'center' });
    doc.font('Helvetica').text(`Generated by: ${generatedBy}`, 0, topY, { align: 'right' });

    doc.moveDown(2);

    // ===== Table layout =====
    const startX = 50;
    let y = doc.y;
    const rowHeight = 18;
    const maxY = doc.page.height - 80;

    // Helper to move to next page when needed
    const ensureSpace = (lines = 1) => {
      if (y + rowHeight * lines > maxY) {
        doc.addPage();
        y = 80;
      }
    };

    // Compute totals for footer
    const valueFor = (p) => (p.unitPrice || 0) * (p.quantityInStock || 0);

    let rows;
    if (safeType === 'expired') {
      rows = products.filter((p) => p.expiryDate && p.expiryDate < now);
    } else if (safeType === 'damaged') {
      rows = products.filter((p) => (p.quantityDamaged || 0) > 0);
    } else if (safeType === 'stock') {
      rows = products;
    } else {
      // summary: show all products, but totals are more important
      rows = products;
    }

    const totalItems = rows.reduce((sum, p) => sum + (p.quantityInStock || 0), 0);
    const totalValue = rows.reduce((sum, p) => sum + valueFor(p), 0);

    // Column widths similar to the example
    const columns = [
      { key: 'sku', label: 'Product ID', width: 70 },
      { key: 'name', label: 'Product Name', width: 160 },
      { key: 'category', label: 'Category', width: 90 },
      { key: 'stockQty', label: 'Stock Quantity', width: 90 },
      { key: 'unitPrice', label: 'Unit Price', width: 90 },
      { key: 'totalValue', label: 'Total Value', width: 90 },
    ];

    const drawHeaderRow = () => {
      ensureSpace(2);
      let x = startX;
      doc.fontSize(10).font('Helvetica-Bold');
      columns.forEach((col) => {
        doc.text(col.label, x, y, { width: col.width, align: 'left' });
        x += col.width;
      });
      y += rowHeight;
      doc.moveTo(startX, y - 4).lineTo(startX + columns.reduce((s, c) => s + c.width, 0), y - 4).stroke();
    };

    const formatCurrency = (num) =>
      (num || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const mapRow = (p) => ({
      sku: p.sku || p._id.toString().slice(-6),
      name: p.name,
      category:
        safeType === 'damaged'
          ? 'Damaged'
          : safeType === 'expired'
          ? 'Expired'
          : (p.supplierId && p.supplierId.name) || p.supplierName || 'General',
      stockQty:
        safeType === 'damaged'
          ? p.quantityDamaged || 0
          : p.quantityInStock != null
          ? p.quantityInStock
          : 0,
      unitPrice: formatCurrency(p.unitPrice || 0),
      totalValue: formatCurrency(valueFor(p)),
    });

    drawHeaderRow();
    doc.font('Helvetica');

    rows.forEach((p) => {
      const r = mapRow(p);
      ensureSpace(1);
      let x = startX;
      Object.keys(r).forEach((key, idx) => {
        const col = columns[idx];
        doc.text(r[key], x, y, { width: col.width, align: idx >= 3 ? 'right' : 'left' });
        x += col.width;
      });
      y += rowHeight;
    });

    if (!rows.length) {
      ensureSpace(1);
      doc.text('No data for this report type.', startX, y);
      y += rowHeight;
    }

    // ===== Footer totals =====
    y += rowHeight;
    ensureSpace(3);
    doc.font('Helvetica-Bold');
    doc.text(`Total Items: ${totalItems}`, startX, y);
    y += rowHeight;
    doc.text(`Total Inventory Value: ${formatCurrency(totalValue)}`, startX, y);
    y += rowHeight * 2;

    // Signature line
    ensureSpace(3);
    const midX = doc.page.width / 2;
    doc.moveTo(midX - 100, y).lineTo(midX + 100, y).stroke();
    y += rowHeight * 0.6;
    doc.fontSize(10).font('Helvetica').text('Approved by: Manager / Director', 0, y, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('Error generating PDF report:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message || 'Failed to generate PDF report' });
    }
  }
});

