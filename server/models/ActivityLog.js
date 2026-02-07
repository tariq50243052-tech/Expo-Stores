const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  action: {
    type: String, // 'Create', 'Edit', 'Delete', 'Bulk Import'
    required: true
  },
  details: {
    type: String
  },
  source: {
    type: String,
    enum: ['Vendor', 'Contractor', 'Technician', 'Initial Setup', 'Other'],
    index: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes for performance
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ store: 1, createdAt: -1 }); // Compound index for store-filtered logs

module.exports = mongoose.model('ActivityLog', activityLogSchema);
