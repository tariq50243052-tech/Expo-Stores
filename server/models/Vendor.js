const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String
  },
  taxId: {
    type: String,
    sparse: true // Allows null/undefined to not be unique
  },
  paymentTerms: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    index: true
  }
}, { timestamps: true });

// Compound indexes for store-scoped uniqueness
vendorSchema.index({ name: 1, store: 1 }, { unique: true });
vendorSchema.index({ taxId: 1, store: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Vendor', vendorSchema);
