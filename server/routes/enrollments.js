const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Schedule = require('../models/Schedule');
const TaskProgress = require('../models/TaskProgress');

// @route   POST /api/enrollments
// @desc    Create an enrollment
router.post('/', async (req, res) => {
  try {
    const { scheduleId, startDate, label } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const sDate = new Date(startDate);
    const targetDate = new Date(sDate);
    targetDate.setDate(targetDate.getDate() + schedule.totalDays);

    let enrollment = await Enrollment.findOne({ userId: req.user.userId, scheduleId });
    if (enrollment) {
      return res.status(400).json({ message: 'Already enrolled in this schedule' });
    }

    enrollment = new Enrollment({
      userId: req.user.userId,
      scheduleId,
      startDate: sDate,
      targetDate,
      label
    });

    await enrollment.save();

    schedule.followerCount += 1;
    await schedule.save();

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/enrollments
// @desc    Get user's active enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.userId, isActive: true })
      .populate('scheduleId');
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/enrollments/:id
// @desc    Get single enrollment
router.get('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('scheduleId');
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment
router.put('/:id', async (req, res) => {
  try {
    const { startDate, targetDate, label } = req.body;
    let enrollment = await Enrollment.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (startDate) enrollment.startDate = startDate;
    if (targetDate) enrollment.targetDate = targetDate;
    if (label) enrollment.label = label;

    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    await TaskProgress.deleteMany({ enrollmentId: req.params.id, userId: req.user.userId });
    
    await Enrollment.findByIdAndDelete(req.params.id);

    await Schedule.findByIdAndUpdate(enrollment.scheduleId, { $inc: { followerCount: -1 } });

    res.json({ message: 'Enrollment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
