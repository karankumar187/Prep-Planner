const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  scheduleTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleTask', required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  actualMinutes: { type: Number, default: null },
  studyCompleted: { type: Boolean, default: false },
  studyMinutes: { type: Number, default: null },
  quizMinutes: { type: Number, default: null },
  mcqScore: {
    type: {
      score: { type: Number },
      total: { type: Number },
      percentage: { type: Number }
    },
    default: null
  },
  mcqAnswers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }]
}, { timestamps: true });

// Compound indexes for ultra-fast query performance
taskProgressSchema.index({ userId: 1, scheduleTaskId: 1, enrollmentId: 1 }, { unique: true });
taskProgressSchema.index({ enrollmentId: 1, userId: 1, completed: 1 });
taskProgressSchema.index({ userId: 1, enrollmentId: 1 });

module.exports = mongoose.model('TaskProgress', taskProgressSchema);
