const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const ScheduleTask = require('../models/ScheduleTask');
const TaskProgress = require('../models/TaskProgress');

// Helper to format date in Asia/Kolkata (IST) timezone
const toDateStr = (d) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(d));
};

// Helper to get day number from date and enrollment start in IST
const getDayNumber = (date, startDate) => {
  const dStr = toDateStr(date);
  const sStr = toDateStr(startDate);
  const [dy, dm, dd] = dStr.split('-').map(Number);
  const [sy, sm, sd] = sStr.split('-').map(Number);
  const dUtc = Date.UTC(dy, dm - 1, dd);
  const sUtc = Date.UTC(sy, sm - 1, sd);
  return Math.floor((dUtc - sUtc) / (1000 * 60 * 60 * 24)) + 1;
};

// @route   GET /api/progress/:enrollmentId
// @desc    Get tasks + progress for a specific date (or all tasks if date='all')
router.get('/:enrollmentId', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).select('scheduleId startDate');
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
      const date = dateParam || toDateStr(new Date());
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
        studyCompleted: p ? (p.studyCompleted || false) : false,
        studyMinutes: p ? (p.studyMinutes || null) : null,
        quizMinutes: p ? (p.quizMinutes || null) : null,
        mcqScore: (p && p.mcqScore && p.mcqScore.total > 0) ? p.mcqScore : null,
        mcqAnswers: (p && p.mcqAnswers && p.mcqAnswers.length > 0) ? p.mcqAnswers : [],
        progress: p || {
          completed: false,
          completedAt: null,
          actualMinutes: null,
          studyCompleted: false,
          studyMinutes: null,
          quizMinutes: null
        }
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/progress/study-complete
// @desc    Mark study material as completed with actual reading time, unlock quiz
router.post('/study-complete', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, studyMinutes } = req.body;

    const [enrollment, task] = await Promise.all([
      Enrollment.findOne({
        _id: enrollmentId,
        userId: req.user.userId
      }).select('_id'),
      ScheduleTask.findById(scheduleTaskId).select('mcqs estimatedMinutes').lean()
    ]);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let progress = await TaskProgress.findOne({
      userId: req.user.userId,
      enrollmentId,
      scheduleTaskId
    });

    const sMinutes = Number(studyMinutes) > 0 ? Number(studyMinutes) : (task.estimatedMinutes || 30);
    const hasQuiz = task.mcqs && task.mcqs.length > 0;

    if (progress) {
      progress.studyCompleted = true;
      progress.studyMinutes = sMinutes;
      // If task has no quiz, completing study notes completes the whole task
      if (!hasQuiz) {
        progress.completed = true;
        progress.completedAt = progress.completedAt || new Date();
        progress.actualMinutes = sMinutes;
      } else {
        // If quiz was already completed, recalculate actualMinutes = studyMinutes + quizMinutes
        if (progress.completed && progress.quizMinutes) {
          progress.actualMinutes = sMinutes + progress.quizMinutes;
        }
      }
      await progress.save();
    } else {
      progress = new TaskProgress({
        userId: req.user.userId,
        enrollmentId,
        scheduleTaskId,
        studyCompleted: true,
        studyMinutes: sMinutes,
        completed: !hasQuiz,
        completedAt: !hasQuiz ? new Date() : null,
        actualMinutes: !hasQuiz ? sMinutes : null,
        mcqScore: null,
        mcqAnswers: []
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/progress/toggle
// @desc    Toggle task completion (Optimized with lean projection)
router.post('/toggle', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, actualMinutes, completed } = req.body;

    const [enrollment, task] = await Promise.all([
      Enrollment.findOne({
        _id: enrollmentId,
        userId: req.user.userId
      }).select('_id'),
      ScheduleTask.findById(scheduleTaskId).select('estimatedMinutes').lean()
    ]);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    let progress = await TaskProgress.findOne({
      userId: req.user.userId,
      enrollmentId,
      scheduleTaskId
    });

    const timeSpent = actualMinutes !== undefined && actualMinutes !== null 
      ? Number(actualMinutes) 
      : (task ? task.estimatedMinutes : 30);

    if (progress) {
      if (typeof completed === 'boolean') {
        progress.completed = completed;
      } else {
        progress.completed = !progress.completed;
      }
      progress.completedAt = progress.completed ? (progress.completedAt || new Date()) : null;
      if (progress.completed) {
        progress.actualMinutes = timeSpent;
      } else {
        progress.actualMinutes = null;
      }
      await progress.save();
    } else {
      const isComp = typeof completed === 'boolean' ? completed : true;
      progress = new TaskProgress({
        userId: req.user.userId,
        enrollmentId,
        scheduleTaskId,
        completed: isComp,
        completedAt: isComp ? new Date() : null,
        actualMinutes: isComp ? timeSpent : null
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
// @desc    Submit MCQ answers, calculate score, mark completed, compute total time (study + quiz)
router.post('/submit-mcq', async (req, res) => {
  try {
    const { scheduleTaskId, enrollmentId, userAnswers, actualMinutes } = req.body;

    const [enrollment, task] = await Promise.all([
      Enrollment.findOne({
        _id: enrollmentId,
        userId: req.user.userId
      }).select('_id'),
      ScheduleTask.findById(scheduleTaskId).select('mcqs estimatedMinutes').lean()
    ]);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
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

    const quizTimeSpent = Number(actualMinutes) > 0 ? Number(actualMinutes) : (task.estimatedMinutes || 20);

    if (progress) {
      progress.completed = true;
      progress.completedAt = new Date();
      progress.quizMinutes = quizTimeSpent;
      // Total actual time = studyMinutes + quizMinutes
      const totalTime = (progress.studyMinutes || 0) + quizTimeSpent;
      progress.actualMinutes = totalTime;
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
        studyCompleted: false,
        studyMinutes: null,
        quizMinutes: quizTimeSpent,
        actualMinutes: quizTimeSpent,
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
    }).select('_id');
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
