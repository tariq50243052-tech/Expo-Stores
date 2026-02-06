const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Store = require('./models/Store');
const Asset = require('./models/Asset');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const fixStores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const mainStoresMap = {
      'SCY ASSET': ['SCY Asset Store'],
      'IT ASSET': ['IT Asset Store'],
      'NOC ASSET': ['NOC Asset Store']
    };

    // 1. Ensure Main Stores exist and are marked
    for (const [mainName, duplicates] of Object.entries(mainStoresMap)) {
      let mainStore = await Store.findOne({ name: mainName });
      
      if (!mainStore) {
        // Check if one of the duplicates exists and rename it?
        // Or create new.
        // Let's see if we can find a duplicate to promote.
        for (const dupName of duplicates) {
          const dup = await Store.findOne({ name: dupName });
          if (dup) {
            console.log(`Renaming ${dupName} to ${mainName}`);
            dup.name = mainName;
            dup.isMainStore = true;
            mainStore = await dup.save();
            break;
          }
        }
        
        if (!mainStore) {
          console.log(`Creating Main Store: ${mainName}`);
          mainStore = await Store.create({ name: mainName, isMainStore: true });
        }
      } else {
        console.log(`Main Store exists: ${mainName}`);
        mainStore.isMainStore = true;
        await mainStore.save();
      }

      // 2. Merge Duplicates
      for (const dupName of duplicates) {
        if (dupName === mainName) continue; // Skip self

        const dupStore = await Store.findOne({ name: dupName });
        if (dupStore) {
          console.log(`Merging ${dupName} into ${mainName}`);
          
          // Move Assets
          const res = await Asset.updateMany(
            { store: dupStore._id },
            { store: mainStore._id }
          );
          console.log(`Moved ${res.modifiedCount} assets.`);

          // Move Users
          const userRes = await User.updateMany(
            { assignedStore: dupStore._id },
            { assignedStore: mainStore._id }
          );
          console.log(`Moved ${userRes.modifiedCount} users.`);

          // Delete duplicate store
          await Store.deleteOne({ _id: dupStore._id });
          console.log(`Deleted duplicate store: ${dupName}`);
        }
      }
    }

    // 3. Mark all other stores as NOT Main
    // Get all Main Store IDs
    const mainStoreDocs = await Store.find({ isMainStore: true });
    const mainStoreIds = mainStoreDocs.map(s => s._id);

    const otherStores = await Store.find({ _id: { $nin: mainStoreIds } });
    console.log(`Found ${otherStores.length} other stores (Locations). Marking as non-main.`);
    
    for (const store of otherStores) {
      store.isMainStore = false;
      // We don't know the parent, so parentStore remains null
      await store.save();
    }

    console.log('Store fix completed.');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixStores();
