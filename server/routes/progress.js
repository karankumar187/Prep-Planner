const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const ScheduleTask = require('../models/ScheduleTask');
const TaskProgress = require('../models/TaskProgress');

// Helper to get day number from date and enrollment start
const getDayNumber = (date, startDate) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  return Math.floor((d - s) / (1000 * 60 * 60 * 24)) + 1;
};

// @route   GET /api/progress/:enrollmentId
// @desc    Get tasks + progress for a specific date (or all tasks if date='all')
router.get('/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const dateParam = req.query.date;
    let scheduleTasks;

    if (dateParam === 'all') {
      scheduleTasks = await ScheduleTask.find({
        scheduleId: enrollment.scheduleId
      }).lean();
    } else {
      const date = dateParam || new Date().toISOString().split('T')[0];
      const dayNum = getDayNumber(date, enrollment.startDate);
      scheduleTasks = await ScheduleTask.find({
        scheduleId: enrollment.scheduleId,
        dayNumber: dayNum
      }).lean();
    }

    const taskIds = scheduleTasks.map(t => t._id);
    const progressDocs = await TaskProgress.find({
      userId: req.user.userId,
      enrollmentId: enrollment._id,
      scheduleTaskId: { $in: taskIds }
    }).lean();

    const progressMap = {};
    progressDocs.forEach(p => {
      progressMap[p.scheduleTaskId.toString()] = p;
    });

    const result = scheduleTasks.map(task => {
      const p = progressMap[task._id.toString()];
      return {
        scheduleTask: task,
        completed: p ? p.completed : false,
        completedAt: p ? p.completedAt : null,
        actualMinutes: p ? p.actualMinutes : null,
        mcqScore: p ? p.mcqScore : null,
        mcqAnswers: p ? p.mcqAnswers : [],
        progress: p || {
          completed: false,
          completedAt: null,
          actualMinutes: null
        }
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/progress/toggle
// @desc    Toggle task completion
router.post('/toggle', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, actualMinutes } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const task = await ScheduleTask.findById(scheduleTaskId);

    let progress = await TaskProgress.findOne({
      userId: req.user.userId,
      enrollmentId,
      scheduleTaskId
    });

    if (progress) {
      progress.completed = !progress.completed;
      progress.completedAt = progress.completed ? new Date() : null;
      if (progress.completed) {
        progress.actualMinutes = actualMinutes || (task ? task.estimatedMinutes : 30);
      }
      await progress.save();
    } else {
      progress = new TaskProgress({
        userId: req.user.userId,
        enrollmentId,
        scheduleTaskId,
        completed: true,
        completedAt: new Date(),
        actualMinutes: actualMinutes || (task ? task.estimatedMinutes : 30)
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/progress/submit-mcq
// @desc    Submit MCQ answers, calculate score, mark completed
router.post('/submit-mcq', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, userAnswers, actualMinutes } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const task = await ScheduleTask.findById(scheduleTaskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let correctCount = 0;
    const totalQuestions = task.mcqs ? task.mcqs.length : 0;
    const mcqAnswers = [];

    if (totalQuestions > 0 && Array.isArray(userAnswers)) {
      task.mcqs.forEach((mcq, idx) => {
        const userAns = userAnswers.find(a => a.questionIndex === idx);
        const selectedOption = userAns ? userAns.selectedOption : -1;
        const isCorrect = selectedOption === mcq.correctOption;
        if (isCorrect) correctCount++;
        mcqAnswers.push({
          questionIndex: idx,
          selectedOption,
          isCorrect
        });
      });
    }

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    let progress = await TaskProgress.findOne({
      userId: req.user.userId,
      enrollmentId,
      scheduleTaskId
    });

    const timeSpent = actualMinutes || task.estimatedMinutes || 20;

    if (progress) {
      progress.completed = true;
      progress.completedAt = new Date();
      progress.actualMinutes = timeSpent;
      progress.mcqScore = {
        score: correctCount,
        total: totalQuestions,
        percentage
      };
      progress.mcqAnswers = mcqAnswers;
      await progress.save();
    } else {
      progress = new TaskProgress({
        userId: req.user.userId,
        enrollmentId,
        scheduleTaskId,
        completed: true,
        completedAt: new Date(),
        actualMinutes: timeSpent,
        mcqScore: {
          score: correctCount,
          total: totalQuestions,
          percentage
        },
        mcqAnswers
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/progress
// @desc    Update actual time spent
router.put('/', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, actualMinutes } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    let progress = await TaskProgress.findOne({
      userId: req.user.userId,
      enrollmentId,
      scheduleTaskId
    });

    if (progress) {
      progress.actualMinutes = actualMinutes;
      await progress.save();
    } else {
      progress = new TaskProgress({
        userId: req.user.userId,
        enrollmentId,
        scheduleTaskId,
        actualMinutes
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
