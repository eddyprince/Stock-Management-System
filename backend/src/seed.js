/**
 * Seed: create default admin user (admin / 12345678) if not exists.
 * Run: npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_management';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await mongoose.connection.collection('users').findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user "admin" already exists.');
    process.exit(0);
    return;
  }
  const adminUser = new User({
    username: 'admin',
    password: '12345678',
    role: 'admin',
    email: 'admin@stock.local',
  });
  await adminUser.save();
  console.log('Created admin user: username=admin, password=12345678');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
