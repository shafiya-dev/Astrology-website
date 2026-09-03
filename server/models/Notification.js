const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, default: 'Message from Admin' },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'success', 'error', 'info'
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
