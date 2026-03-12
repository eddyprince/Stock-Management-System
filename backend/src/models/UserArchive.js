import mongoose from 'mongoose';

// Archived copy of users that have been deleted by an admin.
// This keeps history for auditing without keeping the active account.
const userArchiveSchema = new mongoose.Schema({
  originalUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  role: String,
  email: String,
  displayName: String,
  createdAt: Date,
  updatedAt: Date,
  archivedAt: { type: Date, default: Date.now },
  archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('UserArchive', userArchiveSchema);

