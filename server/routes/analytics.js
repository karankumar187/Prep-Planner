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
// @desc    Get analytics overview for an enrollment (Optimized with projection & O(1) streak set)
router.get('/:enrollmentId/overview', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).select('startDate scheduleId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const scheduleId = enrollment.scheduleId;
    
    // Execute count and progress in parallel
    const [totalTasks, progressDocs] = await Promise.all([
      ScheduleTask.countDocuments({ scheduleId }),
      TaskProgress.find({
        enrollmentId: enrollment._id,
        userId: req.user.userId,
        completed: true
      })
      .select('scheduleTaskId actualMinutes completedAt')
      .populate({
        path: 'scheduleTaskId',
        select: 'dayNumber estimatedMinutes'
      })
      .lean()
    ]);

    const completedCount = progressDocs.length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    // Sum Study Hours
    let totalActualMinutes = 0;
    const completedDayNumbers = new Set();
    const completedDateStringsSet = new Set();

    progressDocs.forEach(p => {
      if (p.actualMinutes && p.actualMinutes > 0) {
        totalActualMinutes += p.actualMinutes;
      } else if (p.scheduleTaskId && p.scheduleTaskId.estimatedMinutes) {
        totalActualMinutes += p.scheduleTaskId.estimatedMinutes;
      } else {
        totalActualMinutes += 20;
      }

      if (p.scheduleTaskId?.dayNumber) {
        completedDayNumbers.add(p.scheduleTaskId.dayNumber);
      }
      if (p.completedAt) {
        completedDateStringsSet.add(new Date(p.completedAt).toISOString().split('T')[0]);
      }
    });

    // Compute Streaks with O(1) Set lookups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(enrollment.startDate);
    startDate.setHours(0, 0, 0, 0);

    const todayDayNum = getDayNumber(today, startDate);

    const isDayActive = (dNum) => {
      if (completedDayNumbers.has(dNum)) return true;
      const targetDate = new Date(startDate);
      targetDate.setDate(targetDate.getDate() + (dNum - 1));
      const targetDateStr = targetDate.toISOString().split('T')[0];
      return completedDateStringsSet.has(targetDateStr);
    };

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

    let currentStreak = 0;
    let scanDay = todayDayNum;

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
// @desc    Get category analytics for an enrollment (Optimized with projection)
router.get('/:enrollmentId/categories', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).select('scheduleId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const [tasks, progress] = await Promise.all([
      ScheduleTask.find({ scheduleId: enrollment.scheduleId }).select('category').lean(),
      TaskProgress.find({
        enrollmentId: enrollment._id,
        userId: req.user.userId,
        completed: true
      }).select('scheduleTaskId').lean()
    ]);

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
      percentage: categoryStats[category].total > 0 ? Math.round((categoryStats[category].completed / categoryStats[category].total) * 100) : 0
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/analytics/:enrollmentId/weekly
// @desc    Get weekly analytics for an enrollment (Optimized with projection)
router.get('/:enrollmentId/weekly', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).select('scheduleId startDate');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(targetDate);
    monday.setDate(diffToMonday);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    const [allTasks, progress] = await Promise.all([
      ScheduleTask.find({ scheduleId: enrollment.scheduleId }).select('dayNumber').lean(),
      TaskProgress.find({
        enrollmentId: enrollment._id,
        userId: req.user.userId,
        completed: true
      }).select('scheduleTaskId').lean()
    ]);

    const completedTaskIds = new Set(progress.map(p => p.scheduleTaskId.toString()));

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);

      let dayNum = getDayNumber(currentDate, enrollment.startDate);
      let dayTasks = allTasks.filter(t => t.dayNumber === dayNum);

      let planned = dayTasks.length;
      let completed = 0;

      dayTasks.forEach(t => {
        if (completedTaskIds.has(t._id.toString())) {
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
// @desc    Get weekly study time analytics (Optimized with projection)
router.get('/:enrollmentId/studytime', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.userId
    }).select('scheduleId startDate');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(targetDate);
    monday.setDate(diffToMonday);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    const [allTasks, progress] = await Promise.all([
      ScheduleTask.find({ scheduleId: enrollment.scheduleId }).select('dayNumber estimatedMinutes').lean(),
      TaskProgress.find({
        enrollmentId: enrollment._id,
        userId: req.user.userId,
        completed: true
      }).select('scheduleTaskId actualMinutes').lean()
    ]);

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
        if (progressMap[t._id.toString()]) {
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
