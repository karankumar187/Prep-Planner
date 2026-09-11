const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const ScheduleTask = require('../models/ScheduleTask');
const Enrollment = require('../models/Enrollment');
const TaskProgress = require('../models/TaskProgress');

// @route   POST /api/schedules
// @desc    Create a schedule
router.post('/', async (req, res) => {
  try {
    const { companyName, title, description, totalDays, color, isPublic } = req.body;

    const schedule = new Schedule({
      creatorId: req.user.userId,
      companyName,
      title,
      description,
      totalDays,
      color,
      isPublic
    });

    await schedule.save();

    // Auto-create enrollment for the creator
    const startDate = new Date();
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + totalDays);

    const enrollment = new Enrollment({
      userId: req.user.userId,
      scheduleId: schedule._id,
      startDate,
      targetDate,
      label: 'My Schedule'
    });

    await enrollment.save();
    
    // Increment follower count
    schedule.followerCount = 1;
    await schedule.save();

    res.status(201).json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper to attach followers to schedules
const attachFollowers = async (schedules) => {
  if (!schedules || schedules.length === 0) return [];
  const scheduleIds = schedules.map(s => s._id);
  const enrollments = await Enrollment.find({ scheduleId: { $in: scheduleIds }, isActive: true })
    .populate('userId', 'name email')
    .lean();

  const followersMap = {};
  enrollments.forEach(e => {
    if (e.userId) {
      const sId = e.scheduleId.toString();
      if (!followersMap[sId]) followersMap[sId] = [];
      followersMap[sId].push({
        _id: e.userId._id,
        name: e.userId.name,
        email: e.userId.email
      });
    }
  });

  return schedules.map(s => ({
    ...s,
    followers: followersMap[s._id.toString()] || []
  }));
};

// @route   GET /api/schedules/explore
// @desc    Get public schedules
router.get('/explore', async (req, res) => {
  try {
    const schedules = await Schedule.find({ isPublic: true })
      .populate('creatorId', 'name email')
      .sort({ followerCount: -1 })
      .lean();
    const schedulesWithFollowers = await attachFollowers(schedules);
    res.json(schedulesWithFollowers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/schedules/my
// @desc    Get my created schedules
router.get('/my', async (req, res) => {
  try {
    const schedules = await Schedule.find({ creatorId: req.user.userId })
      .populate('creatorId', 'name email')
      .lean();
    const schedulesWithFollowers = await attachFollowers(schedules);
    res.json(schedulesWithFollowers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/schedules/:id
// @desc    Get single schedule with tasks
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('creatorId', 'name email').lean();
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    const [tasks, enrollments] = await Promise.all([
      ScheduleTask.find({ scheduleId: req.params.id }).sort({ dayNumber: 1 }).lean(),
      Enrollment.find({ scheduleId: req.params.id, isActive: true }).populate('userId', 'name email').lean()
    ]);
    schedule.followers = enrollments
      .filter(e => e.userId)
      .map(e => ({ _id: e.userId._id, name: e.userId.name, email: e.userId.email }));

    res.json({ schedule, tasks });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/schedules/:id
// @desc    Update a schedule
router.put('/:id', async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.creatorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/schedules/:id
// @desc    Delete a schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.creatorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await ScheduleTask.deleteMany({ scheduleId: req.params.id });
    await TaskProgress.deleteMany({ enrollmentId: { $in: await Enrollment.find({ scheduleId: req.params.id }).distinct('_id') } });
    await Enrollment.deleteMany({ scheduleId: req.params.id });
    await Schedule.findByIdAndDelete(req.params.id);

    res.json({ message: 'Schedule removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
