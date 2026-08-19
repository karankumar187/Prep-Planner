const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }
});

const scheduleTaskSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['DSA', 'SQL', 'DBMS', 'OOP', 'CN', 'OS', 'Java', 'Frontend', 'Technical', 'Aptitude', 'Communication', 'Interview', 'Mock Test', 'MCQ Assessment'], 
    required: true 
  },
  taskType: { type: String, enum: ['task', 'assessment'], default: 'task' },
  link: { type: String, default: '' },
  dayNumber: { type: Number, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  estimatedMinutes: { type: Number, default: 30 },
  mcqs: [mcqSchema]
}, { timestamps: true });

scheduleTaskSchema.index({ scheduleId: 1, dayNumber: 1 });

module.exports = mongoose.model('ScheduleTask', scheduleTaskSchema);
