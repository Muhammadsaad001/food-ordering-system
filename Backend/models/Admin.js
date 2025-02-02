const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },

   address: { type: String },
    role: { type: String, default: 'admin' }, // Default role is admin
  }, { timestamps: true });
  
  module.exports = mongoose.model('Admin', adminSchema);
  