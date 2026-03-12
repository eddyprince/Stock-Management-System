/**
 * MongoDB connection.
 * Load MONGODB_URI from environment (or .env file via dotenv).
 */
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_management';

  if (uri.includes('REPLACE_WITH_YOUR_PASSWORD') || uri.includes('PUT_YOUR_ATLAS_PASSWORD_HERE')) {
    console.error('');
    console.error('*** FIX: Open backend/.env and replace the password placeholder with your real Atlas password ***');
    console.error('    The password is the one you set for user "cyubahiroeddyprince_db_user" in MongoDB Atlas.');
    console.error('    If the password has # or @, URL-encode it (e.g. # → %23).');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (err.message && (err.message.includes('auth') || err.message.includes('Authentication'))) {
      console.error('');
      console.error('*** Wrong password: In backend/.env set MONGODB_URI with the correct password for cyubahiroeddyprince_db_user ***');
    } else if (!uri || uri.includes('localhost:27017')) {
      console.error('');
      console.error('Use MongoDB Atlas: put your Atlas connection string in backend/.env');
      console.error('Get the URI from: https://cloud.mongodb.com → your cluster → Connect → Drivers.');
    } else {
      console.error('Check backend/.env: correct password and Atlas Network Access (allow 0.0.0.0/0 for testing).');
    }
    process.exit(1);
  }
};

export default connectDB;
