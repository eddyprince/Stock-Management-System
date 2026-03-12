import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tin: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  fax: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

clientSchema.index({ tin: 1 }, { unique: true });

export default mongoose.model('Client', clientSchema);

