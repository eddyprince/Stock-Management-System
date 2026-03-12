/**
 * Runnable Node.js version of the MongoDB Playground.
 * Run from project root: node playground-1.mongodb.js
 * Requires: MongoDB running (or set MONGODB_URI in backend/.env).
 */
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, 'backend', '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'mongodbVSCodePlaygroundDB';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const sales = db.collection('sales');

    await sales.deleteMany({});
    await sales.insertMany([
      { item: 'abc', price: 10, quantity: 2, date: new Date('2014-03-01T08:00:00Z') },
      { item: 'jkl', price: 20, quantity: 1, date: new Date('2014-03-01T09:00:00Z') },
      { item: 'xyz', price: 5, quantity: 10, date: new Date('2014-03-15T09:00:00Z') },
      { item: 'xyz', price: 5, quantity: 20, date: new Date('2014-04-04T11:21:39.736Z') },
      { item: 'abc', price: 10, quantity: 10, date: new Date('2014-04-04T21:23:13.331Z') },
      { item: 'def', price: 7.5, quantity: 5, date: new Date('2015-06-04T05:08:13Z') },
      { item: 'def', price: 7.5, quantity: 10, date: new Date('2015-09-10T08:43:00Z') },
      { item: 'abc', price: 10, quantity: 5, date: new Date('2016-02-06T20:20:13Z') },
    ]);

    const salesOnApril4th = await sales.countDocuments({
      date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') },
    });
    console.log(`${salesOnApril4th} sales occurred in 2014.`);

    const agg = sales.aggregate([
      { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
      { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    ]);
    const result = await agg.toArray();
    console.log('2014 totals by item:', result);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
