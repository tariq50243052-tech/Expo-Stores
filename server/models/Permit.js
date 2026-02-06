const mongoose = require('mongoose');

const permitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['storage', 'work', 'movement']
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Permit', permitSchema);
