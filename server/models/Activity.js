// server/models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  venue: String,
  date: Date,
  deadline: { type: Date, required: true },
  requiredSkills: [String],
  seats: Number,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  removedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
