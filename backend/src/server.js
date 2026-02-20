/**
 * Express server: auth, products, suppliers, reports, users.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/suppliers.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';

await connectDB();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
