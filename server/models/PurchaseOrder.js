const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date
  },
  items: [{
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  taxTotal: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  attachments: [String],
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Cancelled'],
    default: 'Draft',
    index: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Indexes
purchaseOrderSchema.index({ vendor: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
