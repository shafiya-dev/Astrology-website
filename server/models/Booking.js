const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  preferredDateTime: { type: String, required: true },
  notes: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
