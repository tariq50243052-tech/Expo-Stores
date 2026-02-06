const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Ordered', 'Rejected'], default: 'Pending' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

