import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0.18 },
    netAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema({
  buyerName: { type: String, required: true, trim: true },
  buyerTin: { type: String, required: true, trim: true },
  buyerContact: { type: String, trim: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  paymentMethod: {
    type: String,
    enum: ['cash', 'phone', 'bank', 'code', 'debt', 'cheque'],
    required: true,
  },
  items: { type: [saleItemSchema], default: [] },
  totalNet: { type: Number, required: true, min: 0 },
  totalTax: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRefund: { type: Boolean, default: false },
  originalSaleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Sale', saleSchema);

