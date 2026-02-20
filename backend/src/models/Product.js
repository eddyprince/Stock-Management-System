/**
 * Product model: name, SKU, quantities (in/out/damaged), total supplied, supplier, expiry.
 * "Where it is from" = supplierId; total amount supplied = totalSupplied.
 */
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, trim: true, unique: true, sparse: true },
  quantityInStock: { type: Number, default: 0, min: 0 },
  quantityOutOfStock: { type: Number, default: 0, min: 0 },
  quantityDamaged: { type: Number, default: 0, min: 0 },
  totalSupplied: { type: Number, default: 0, min: 0 },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierName: { type: String, trim: true },
  expiryDate: { type: Date },
  unitPrice: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

productSchema.virtual('stockStatus').get(function () {
  if (this.quantityInStock > 0) return 'in_stock';
  if (this.quantityOutOfStock > 0) return 'out_of_stock';
  return 'no_stock';
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
