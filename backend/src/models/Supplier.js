/**
 * Supplier model: where products come from.
 */
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, trim: true },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Supplier', supplierSchema);
