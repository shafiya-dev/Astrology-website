const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, default: 'Message from Admin' },
  message: { type: String, required: true },
  originalMessage: { type: String }, // To store context of user's query
  type: { type: String, default: 'info' }, // 'success', 'error', 'info', 'booking_update'
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
