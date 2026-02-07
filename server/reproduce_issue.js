const mongoose = require('mongoose');
const Asset = require('./models/Asset');
const Store = require('./models/Store');
require('dotenv').config();

async function reproduceIssue() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const store = await Store.findOne({ name: { $regex: /SCY ASSET/i } });
    if (!store) {
      console.log('Store not found');
      return;
    }

    console.log(`Store ID (ObjectId): ${store._id}`);
    const storeIdString = store._id.toString();
    console.log(`Store ID (String): "${storeIdString}"`);

    // Case 1: Filter with ObjectId (Should work)
    const filterObjectId = { store: store._id };
    const countObjectId = await Asset.aggregate([{ $match: filterObjectId }, { $count: 'count' }]);
    console.log('Aggregate match with ObjectId count:', countObjectId[0]?.count || 0);

    // Case 2: Filter with String (Might fail)
    const filterString = { store: storeIdString };
    const countString = await Asset.aggregate([{ $match: filterString }, { $count: 'count' }]);
    console.log('Aggregate match with String count:', countString[0]?.count || 0);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

reproduceIssue();