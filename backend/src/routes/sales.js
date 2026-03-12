import express from 'express';
import PDFDocument from 'pdfkit';
import Sale from '../models/Sale.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create a sale (stock manager / accountant)
router.post('/', authenticate, requireRole('stock_manager', 'account', 'admin'), async (req, res) => {
  try {
    const { buyerName, buyerTin, buyerContact, items, clientId, paymentMethod } = req.body;
    if (!buyerName || !buyerTin) {
      return res.status(400).json({ message: 'Buyer name and TIN / number are required.' });
    }
    const phonePattern = /^07(2|3|8|9)\d{7}$/;
    const tinPattern = /^1\d{8}$/;
    if (!tinPattern.test(String(buyerTin).trim())) {
      return res
        .status(400)
        .json({ message: 'TIN must start with 1 and have exactly 9 digits.' });
    }
    if (buyerContact && !phonePattern.test(String(buyerContact).trim())) {
      return res.status(400).json({
        message: 'Phone must start with 078/072/079/073 and have exactly 10 digits.',
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required.' });
    }
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'At least one product is required.' });
    }

    const TAX_RATE = 0.18;
    const populatedItems = [];
    let resolvedClientId = clientId || null;

    // Optionally create or reuse client
    if (!resolvedClientId && buyerTin) {
      let client = await Client.findOne({ tin: String(buyerTin).trim() });
      if (!client) {
        client = await Client.create({
          name: buyerName,
          tin: String(buyerTin).trim(),
          phone: buyerContact || '',
        });
      }
      resolvedClientId = client._id;
    }

    for (const item of items) {
      const { productId, quantity, unitPrice } = item || {};
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Each item must have productId and positive quantity.' });
      }

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      if ((product.quantityInStock || 0) < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
      }

      const price = unitPrice != null ? Number(unitPrice) : product.unitPrice || 0;
      const net = price * quantity;
      const tax = net * TAX_RATE;
      const total = net + tax;

      // Update product stock
      product.quantityInStock = (product.quantityInStock || 0) - quantity;
      product.quantityOutOfStock = (product.quantityOutOfStock || 0) + quantity;
      await product.save();

      // Record stock transaction (out)
      await StockTransaction.create({
        productId: product._id,
        type: 'out',
        quantity,
        amount: net,
        userId: req.user._id,
        note: `Sale to ${buyerName}${buyerTin ? ` (${buyerTin})` : ''}`,
      });

      populatedItems.push({
        productId: product._id,
        productName: product.name,
        quantity,
        unitPrice: price,
        taxRate: TAX_RATE,
        netAmount: net,
        taxAmount: tax,
        totalAmount: total,
      });
    }

    const totalNet = populatedItems.reduce((s, it) => s + it.netAmount, 0);
    const totalTax = populatedItems.reduce((s, it) => s + it.taxAmount, 0);
    const totalAmount = populatedItems.reduce((s, it) => s + it.totalAmount, 0);

    const sale = await Sale.create({
      buyerName,
      buyerTin,
      buyerContact,
      clientId: resolvedClientId,
      paymentMethod,
      items: populatedItems,
      totalNet,
      totalTax,
      totalAmount,
      userId: req.user._id,
    });

    res.status(201).json({ sale });
  } catch (err) {
    console.error('Create sale error:', err);
    res.status(500).json({ message: err.message || 'Failed to create sale' });
  }
});

// List sales (director or admin) - basic summary
router.get('/', authenticate, requireRole('director', 'admin'), async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('userId', 'username role')
      .populate('clientId', 'name tin')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load sales' });
  }
});

// Receipt PDF for a sale
router.get('/:id/receipt', authenticate, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('userId', 'username role');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="receipt-${sale._id}.pdf"`);
    doc.pipe(res);

    // Header similar to inventory report, but as receipt
    doc.fontSize(18).font('Helvetica-Bold').text('Stock Management System', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica-Bold').text('Sales Receipt', { align: 'center' });
    doc.moveDown(1);

    const dateStr = sale.createdAt.toLocaleString();
    doc.fontSize(10).font('Helvetica');
    const topY = doc.y;
    doc.text(`Date: ${dateStr}`, 50, topY);
    doc.text(`Receipt ID: ${sale._id.toString().slice(-8)}`, 0, topY, { align: 'center' });
    doc.text(`Cashier: ${sale.userId?.username || ''}`, 0, topY, { align: 'right' });

    doc.moveDown(2);

    // Buyer info
    doc.font('Helvetica-Bold').text('Buyer Information');
    doc.moveDown(0.5);
    doc.font('Helvetica');
    doc.text(`Name: ${sale.buyerName}`);
    if (sale.buyerTin) doc.text(`TIN / Number: ${sale.buyerTin}`);
    if (sale.buyerContact) doc.text(`Contact: ${sale.buyerContact}`);
    if (sale.paymentMethod) doc.text(`Payment method: ${sale.paymentMethod}`);
    doc.moveDown(1);

    // Items table
    const startX = 50;
    let y = doc.y;
    const rowHeight = 18;
    const maxY = doc.page.height - 80;

    const ensureSpace = (lines = 1) => {
      if (y + rowHeight * lines > maxY) {
        doc.addPage();
        y = 80;
      }
    };

    const columns = [
      { key: 'productName', label: 'Product', width: 170 },
      { key: 'quantity', label: 'Qty', width: 50 },
      { key: 'unitPrice', label: 'Unit Price', width: 80 },
      { key: 'netAmount', label: 'Net', width: 80 },
      { key: 'taxAmount', label: 'Tax (18%)', width: 80 },
      { key: 'totalAmount', label: 'Total', width: 80 },
    ];

    const formatCurrency = (num) =>
      (num || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const drawHeaderRow = () => {
      ensureSpace(2);
      let x = startX;
      doc.fontSize(10).font('Helvetica-Bold');
      columns.forEach((col) => {
        doc.text(col.label, x, y, { width: col.width, align: ['Qty'].includes(col.label) ? 'right' : 'left' });
        x += col.width;
      });
      y += rowHeight;
      doc.moveTo(startX, y - 4).lineTo(startX + columns.reduce((s, c) => s + c.width, 0), y - 4).stroke();
    };

    drawHeaderRow();
    doc.font('Helvetica');

    sale.items.forEach((it) => {
      ensureSpace(1);
      let x = startX;
      const row = {
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: formatCurrency(it.unitPrice),
        netAmount: formatCurrency(it.netAmount),
        taxAmount: formatCurrency(it.taxAmount),
        totalAmount: formatCurrency(it.totalAmount),
      };
      Object.entries(row).forEach(([key, value], idx) => {
        const col = columns[idx];
        doc.text(String(value), x, y, { width: col.width, align: idx === 0 ? 'left' : 'right' });
        x += col.width;
      });
      y += rowHeight;
    });

    y += rowHeight;
    ensureSpace(3);
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: ${formatCurrency(sale.totalNet)}`, startX, y, { align: 'left' });
    y += rowHeight;
    doc.text(`Tax 18%: ${formatCurrency(sale.totalTax)}`, startX, y, { align: 'left' });
    y += rowHeight;
    doc.text(`Total to pay: ${formatCurrency(sale.totalAmount)}`, startX, y, { align: 'left' });

    doc.moveDown(3);
    const midX = doc.page.width / 2;
    const sigY = doc.y;
    doc.moveTo(midX - 80, sigY).lineTo(midX + 80, sigY).stroke();
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text('Buyer signature', 0, doc.y, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('Receipt error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message || 'Failed to generate receipt' });
    }
  }
});

export default router;

