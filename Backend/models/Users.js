const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, default: 'user' }, // Default role is user
}, { timestamps: true });

module.exports = mongoose.model('Persons', userSchema);
