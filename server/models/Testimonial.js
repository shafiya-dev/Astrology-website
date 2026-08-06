const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
