const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const ScheduleTask = require('../models/ScheduleTask');
const TaskProgress = require('../models/TaskProgress');

// Helper to get day number from date
const getDayNumber = (date, startDate) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  return Math.floor((d - s) / (1000 * 60 * 60 * 24)) + 1;
};

// @route   GET /api/analytics/:enrollmentId/overview
// @desc    Get analytics overview for an enrollment
router.get('/:enrollmentId/overview', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).populate('scheduleId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const scheduleId = enrollment.scheduleId._id;
    const totalTasks = await ScheduleTask.countDocuments({ scheduleId });
    const progressDocs = await TaskProgress.find({
      enrollmentId: enrollment._id,
      userId: req.user.userId,
      completed: true
    }).populate('scheduleTaskId');

    const completedCount = progressDocs.length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    // Total Study Hours calculation (sum actualMinutes or fallback to estimatedMinutes)
    let totalActualMinutes = 0;
    progressDocs.forEach(p => {
      if (p.actualMinutes && p.actualMinutes > 0) {
        totalActualMinutes += p.actualMinutes;
      } else if (p.scheduleTaskId && p.scheduleTaskId.estimatedMinutes) {
        totalActualMinutes += p.scheduleTaskId.estimatedMinutes;
      } else {
        totalActualMinutes += 20; // Default fallback
      }
    });

    const tasks = await ScheduleTask.find({ scheduleId }).lean();

    // Compute Streaks accurately
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(enrollment.startDate);
    startDate.setHours(0, 0, 0, 0);

    const completedDayNumbers = new Set();
    progressDocs.forEach(p => {
      if (p.scheduleTaskId) {
        completedDayNumbers.add(p.scheduleTaskId.dayNumber);
      }
    });

    const todayDayNum = getDayNumber(today, startDate);

    // A day is active if any task assigned to that dayNumber is completed OR completed on that date
    const isDayActive = (dNum) => {
      if (completedDayNumbers.has(dNum)) return true;
      
      const targetDate = new Date(startDate);
      targetDate.setDate(targetDate.getDate() + (dNum - 1));
      const targetDateStr = targetDate.toISOString().split('T')[0];

      return progressDocs.some(p => {
        if (!p.completedAt) return false;
        const compDateStr = new Date(p.completedAt).toISOString().split('T')[0];
        return compDateStr === targetDateStr;
      });
    };

    // Calculate Best Streak across all elapsed days
    let bestStreak = 0;
    let tempStreak = 0;
    for (let d = 1; d <= Math.max(1, todayDayNum); d++) {
      if (isDayActive(d)) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Calculate Current Active Streak
    let currentStreak = 0;
    let scanDay = todayDayNum;

    // If today's tasks are not completed yet, hold streak from yesterday if active
    if (!isDayActive(todayDayNum)) {
      scanDay = todayDayNum - 1;
    }

    while (scanDay >= 1 && isDayActive(scanDay)) {
      currentStreak++;
      scanDay--;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    res.json({
      completionRate,
      completed: completedCount,
      totalTasks,
      studyHours: parseFloat((totalActualMinutes / 60).toFixed(1)),
      currentStreak,
      bestStreak
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/analytics/:enrollmentId/categories
// @desc    Get category analytics for an enrollment
router.get('/:enrollmentId/categories', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const tasks = await ScheduleTask.find({ scheduleId: enrollment.scheduleId }).lean();
    const progress = await TaskProgress.find({
      enrollmentId: enrollment._id,
      userId: req.user.userId,
      completed: true
    }).lean();

    const completedTaskIds = new Set(progress.map(p => p.scheduleTaskId.toString()));

    const categoryStats = {};

    tasks.forEach(task => {
      if (!categoryStats[task.category]) {
        categoryStats[task.category] = { total: 0, completed: 0 };
      }
      categoryStats[task.category].total++;
      if (completedTaskIds.has(task._id.toString())) {
        categoryStats[task.category].completed++;
      }
    });

    const result = Object.keys(categoryStats).map(category => ({
      category,
      total: categoryStats[category].total,
      completed: categoryStats[category].completed,
      percentage: Math.round((categoryStats[category].completed / categoryStats[category].total) * 100)
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/analytics/:enrollmentId/weekly
// @desc    Get weekly analytics for an enrollment
router.get('/:enrollmentId/weekly', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(targetDate);
    monday.setDate(diffToMonday);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    const allTasks = await ScheduleTask.find({ scheduleId: enrollment.scheduleId }).lean();
    const progress = await TaskProgress.find({
      enrollmentId: enrollment._id,
      userId: req.user.userId
    }).lean();

    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.scheduleTaskId.toString()] = p;
    });

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);

      let dayNum = getDayNumber(currentDate, enrollment.startDate);
      let dayTasks = allTasks.filter(t => t.dayNumber === dayNum);

      let planned = dayTasks.length;
      let completed = 0;

      dayTasks.forEach(t => {
        if (progressMap[t._id.toString()] && progressMap[t._id.toString()].completed) {
          completed++;
        }
      });

      result.push({
        day: weekDays[i],
        date: currentDate.toISOString().split('T')[0],
        planned,
        completed,
        percentage: planned > 0 ? Math.round((completed / planned) * 100) : 0
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/analytics/:enrollmentId/studytime
// @desc    Get weekly study time analytics
router.get('/:enrollmentId/studytime', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(targetDate);
    monday.setDate(diffToMonday);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    const allTasks = await ScheduleTask.find({ scheduleId: enrollment.scheduleId }).lean();
    const progress = await TaskProgress.find({
      enrollmentId: enrollment._id,
      userId: req.user.userId
    }).lean();

    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.scheduleTaskId.toString()] = p;
    });

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);

      let dayNum = getDayNumber(currentDate, enrollment.startDate);
      let dayTasks = allTasks.filter(t => t.dayNumber === dayNum);

      let estimatedMinutes = 0;
      let actualMinutes = 0;

      dayTasks.forEach(t => {
        estimatedMinutes += (t.estimatedMinutes || 0);
        if (progressMap[t._id.toString()] && progressMap[t._id.toString()].completed) {
          actualMinutes += (progressMap[t._id.toString()].actualMinutes || t.estimatedMinutes || 20);
        }
      });

      result.push({
        day: weekDays[i],
        estimated: parseFloat((estimatedMinutes / 60).toFixed(2)),
        actual: parseFloat((actualMinutes / 60).toFixed(2))
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
