const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profileImage: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }, // Added default
  engineeringType: { type: String, required: true },
  passoutYear: { type: Number, required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true }, // Role in company
  companyLocation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  linkedin: { type: String }
}, {
  timestamps: true
});

const Alumni = mongoose.model('Alumni', alumniSchema);
module.exports = Alumni;