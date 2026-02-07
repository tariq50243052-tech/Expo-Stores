const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Store = require('./models/Store');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedStoresAndAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Ensure Main Stores exist
    const storesData = [
      { name: 'SCY ASSET', alias: 'scy' },
      { name: 'IT ASSET', alias: 'it' },
      { name: 'NOC ASSET', alias: 'noc' }
    ];

    const storeMap = {};

    for (const data of storesData) {
      let store = await Store.findOne({ name: data.name });
      if (!store) {
        store = await Store.create({ 
            name: data.name, 
            isMainStore: true
        });
        console.log(`Created Main Store: ${store.name}`);
      } else {
        if (!store.isMainStore) {
            store.isMainStore = true;
            await store.save();
        }
        console.log(`Store exists: ${store.name}`);
      }
      storeMap[data.alias] = store;
    }

    // 2. Create Super Admin
    const superAdminEmail = 'superadmin@expo.com';
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    let superAdmin = await User.findOne({ email: superAdminEmail });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'Super Admin',
      });
      console.log(`Created Super Admin: ${superAdminEmail}`);
    } else {
      if (superAdmin.role !== 'Super Admin') {
        superAdmin.role = 'Super Admin';
        await superAdmin.save();
      }
      console.log(`Super Admin exists: ${superAdminEmail}`);
    }

    // 3. Create Specific Store Admins
    const admins = [
      { email: 'admin@scy.com', name: 'SCY Admin', store: storeMap['scy'] },
      { email: 'admin@itstore.com', name: 'IT Admin', store: storeMap['it'] },
      { email: 'admin@nocstore.com', name: 'NOC Admin', store: storeMap['noc'] }
    ];

    for (const adminData of admins) {
      let adminUser = await User.findOne({ email: adminData.email });
      if (!adminUser) {
        await User.create({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          role: 'Admin',
          assignedStore: adminData.store._id
        });
        console.log(`Created Admin: ${adminData.email} -> ${adminData.store.name}`);
      } else {
        // Update assignment if missing or wrong
        if (!adminUser.assignedStore || !adminUser.assignedStore.equals(adminData.store._id)) {
            adminUser.assignedStore = adminData.store._id;
            adminUser.role = 'Admin'; // Ensure role is Admin
            await adminUser.save();
            console.log(`Updated Admin assignment: ${adminData.email} -> ${adminData.store.name}`);
        } else {
            console.log(`Admin exists and correct: ${adminData.email}`);
        }
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedStoresAndAdmin();
