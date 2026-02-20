/**
 * Seed: create default admin user (eddyprince / 123) if not exists.
 * Run: npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_management';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await mongoose.connection.collection('users').findOne({ username: 'eddyprince' });
  if (existing) {
    console.log('Admin user eddyprince already exists.');
    process.exit(0);
    return;
  }
  const admin = new User({
    username: 'eddyprince',
    password: '123',
    role: 'admin',
    email: 'admin@stock.local',
  });
  await admin.save();
  console.log('Created admin user: username=eddyprince, password=123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
