const mongoose = require('mongoose');
const Asset = require('./models/Asset');
const Store = require('./models/Store');
require('dotenv').config();

async function debugStoreAssets() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Find the Store "SCY ASSET" (or similar name from screenshot)
    // The screenshot shows "SCY Admin" and "SCY ASSET" in the header (which is likely the store name)
    const store = await Store.findOne({ name: { $regex: /SCY ASSET/i } });
    
    if (!store) {
      console.log('Store "SCY ASSET" not found. Listing all stores:');
      const stores = await Store.find({}, 'name');
      console.log(stores.map(s => s.name));
      return;
    }

    console.log(`Found Store: ${store.name} (${store._id})`);

    // 2. Count Assets
    const filter = { store: store._id };
    const count = await Asset.countDocuments(filter);
    console.log(`Total Assets in Store: ${count}`);

    // 3. Run Aggregation
    const modelCounts = await Asset.aggregate([
      { $match: filter },
      { $group: { _id: '$model_number', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('Aggregation Result (model_number):');
    console.log(JSON.stringify(modelCounts, null, 2));

    // 4. Check if field is actually "model" or "model_number" in DB
    const sampleAsset = await Asset.findOne(filter).lean();
    if (sampleAsset) {
      console.log('Sample Asset fields:', Object.keys(sampleAsset));
      console.log('Sample Asset model_number:', sampleAsset.model_number);
      console.log('Sample Asset model:', sampleAsset.model);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugStoreAssets();