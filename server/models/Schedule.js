const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  totalDays: { type: Number, required: true },
  color: { type: String, default: '#6366f1' },
  isPublic: { type: Boolean, default: true },
  followerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
