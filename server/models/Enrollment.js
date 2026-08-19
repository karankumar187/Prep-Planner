const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  startDate: { type: Date, required: true },
  targetDate: { type: Date, required: true },
  label: { type: String, default: 'Assessment' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

enrollmentSchema.index({ userId: 1, scheduleId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
