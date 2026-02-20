/**
 * StockTransaction: record of stock movement (in/out/damaged) for history and accounting.
 */
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['in', 'out', 'damaged', 'adjustment'], required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('StockTransaction', transactionSchema);
