const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profileImage: { type: String },
  engineeringType: { type: String, required: true },
  passoutYear: { type: Number, required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true }, // This is role in company
  companyLocation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  linkedin: { type: String },
}, {
  timestamps: true,
});

const Alumni = mongoose.model('Alumni', alumniSchema);
module.exports = Alumni;