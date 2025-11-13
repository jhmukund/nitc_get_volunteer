// server/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  status: { type: String, enum: ['applied','shortlisted','accepted','rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ApplicationSchema.index({ student: 1, activity: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
