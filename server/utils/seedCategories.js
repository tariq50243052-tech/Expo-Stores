const mongoose = require('mongoose');
const AssetCategory = require('../models/AssetCategory');

const seedData = [
  {
    name: "Access Control Systems",
    types: [
      { name: "Door Controllers", products: ["ACC-G2", "ACC-AP", "ACC Lite"] },
      { name: "Card Readers", products: ["Card Reader", "Biometric Card Reader", "Palm Reader"] },
      { name: "Reader Interfaces", products: ["FR Panel", "SRI", "DRI", "ERI"] },
      { name: "Input/Output Modules", products: ["Input Module", "Output Module"] },
      { name: "Locks", products: ["Electric Strike Lock", "Magnetic Lock", "Shear Lock", "Dropbolt Lock"] },
      { name: "ACS Accessories", products: ["Push Button", "Power Supply Adapter", "Batteries", "Break Glass"] },
      { name: "Speed Gates & Arm Barriers", products: ["Speed Gate", "Swing Gate", "Bollards/RoadBlocker", "Turnstile", "Remote Controller", "Arm Barrier"] },
      { name: "Speed Gates & Arm Barriers Accessories", products: ["Barrier Arm", "Power Supply Adapter", "Sensors", "Remote", "Miscellaneous"] }
    ]
  },
  {
    name: "Surveillance Systems",
    types: [
      { name: "Cameras", products: ["Fixed Bullet", "Fixed Dome", "Fixed Box", "PTZ", "Lift Camera", "ANPR Camera"] },
      { name: "Camera Accessories", products: ["PoE Adapter", "Power Supply Adapter", "Pendant Support", "Mounting Bracket", "Camera Glass Cover"] },
      { name: "Videowall", products: ["CCTV Monitor", "Video Wall Screens", "Decoders", "Matrix Switch"] }
    ]
  },
  {
    name: "Servers & Workstations",
    types: [
      { name: "Server Units", products: ["NVR Server", "FNVR Server", "VMS Server", "FR Server", "ANPR Server", "Database Server"] },
      { name: "Storage Devices", products: ["HDD", "Graphics Card", "SSD", "RAM"] },
      { name: "Server Accessories", products: ["CMOS Battery", "SMPS"] }
    ]
  },
  {
    name: "Networking",
    types: [
      { name: "Switches", products: ["PoE Industrial Unmanaged Switch", "PoE Injector"] },
      { name: "Panels & Power", products: ["Patch Panel", "Switching Power Supply"] }
    ]
  },
  {
    name: "Wireless Systems",
    types: [
      { name: "Microwave & Solar", products: ["PV Solar Panel", "Antenna", "Batteries", "Mobile Trolley"] }
    ]
  },
  {
    name: "Tools",
    types: [
      { name: "Electrical / Installation Tools", products: ["Screw Driver Set", "Drilling Machine / Tighteners", "Digital Multimeter", "Spanner Set", "Precision Screw Driver Set", "Cutter/Stripping Tool", "Crimping Tool", "Screw Threading Tool", "IPC Tester", "Ladder"] }
    ]
  },
  {
    name: "Store Consumables",
    types: [
      { name: "Cleaning & Maintenance Items", products: ["Cleaning Clothes", "Cable Ties / Metal Ties", "Lubricants & Sprays", "Insulation Tape", "RJ45 Connectors", "Network Cables", "Screws, Bolts & Nuts", "Electrical Power Cables", "Fixtures & Brackets", "Power Supply Adapters", "Cleaning Liquid Spray", "Miscellaneous", "Network Patch Cables", "Connectors", "Terminal Blocks", "Printer Ribbons"] }
    ]
  }
];

const seedCategories = async () => {
  try {
    for (const catData of seedData) {
      let category = await AssetCategory.findOne({ name: catData.name });
      
      if (!category) {
        // Create new category
        category = new AssetCategory({
          name: catData.name,
          types: []
        });
      }

      // Process Types
      for (const typeData of catData.types) {
        let type = category.types.find(t => t.name === typeData.name);
        
        if (!type) {
          category.types.push({ name: typeData.name, products: [] });
          type = category.types.find(t => t.name === typeData.name);
        }

        // Process Products
        for (const prodName of typeData.products) {
          const productExists = type.products.some(p => p.name === prodName);
          if (!productExists) {
            type.products.push({ name: prodName, children: [] });
          }
        }
      }

      await category.save();
      console.log(`Processed category: ${catData.name}`);
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = seedCategories;
