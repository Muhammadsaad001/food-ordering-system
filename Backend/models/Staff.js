const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
   
    department: { type: String, required: true },
    role: { type: String, default: 'staff' }, // Default role is staff
  }, { timestamps: true });
  
  module.exports = mongoose.model('Staff', staffSchema);
  