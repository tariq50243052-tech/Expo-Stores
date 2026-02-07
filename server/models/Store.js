const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isMainStore: {
    type: Boolean,
    default: false,
    index: true
  },
  parentStore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    default: null,
    index: true
  },
  deletionRequested: {
    type: Boolean,
    default: false
  },
  deletionRequestedAt: {
    type: Date
  },
  deletionRequestedBy: {
    type: String, // Store email or name of requester
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
