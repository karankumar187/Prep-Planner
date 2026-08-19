const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const ScheduleTask = require('../models/ScheduleTask');

// Middleware to check if user is creator
const checkCreator = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId || req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    if (schedule.creatorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// @route   POST /api/schedules/:id/tasks
// @desc    Add a ScheduleTask
router.post('/schedules/:id/tasks', checkCreator, async (req, res) => {
  try {
    const task = new ScheduleTask({
      scheduleId: req.params.id,
      ...req.body
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/schedules/:id/tasks/bulk
// @desc    Add multiple ScheduleTasks
router.post('/schedules/:id/tasks/bulk', checkCreator, async (req, res) => {
  try {
    const tasks = req.body.map(task => ({
      ...task,
      scheduleId: req.params.id
    }));
    const createdTasks = await ScheduleTask.insertMany(tasks);
    res.status(201).json(createdTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/schedules/:id/tasks
// @desc    Get tasks for a schedule
router.get('/schedules/:id/tasks', async (req, res) => {
  try {
    let query = { scheduleId: req.params.id };
    if (req.query.day) {
      query.dayNumber = req.query.day;
    }
    const tasks = await ScheduleTask.find(query).sort({ dayNumber: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/schedules/:scheduleId/tasks/:taskId
// @desc    Update a task
router.put('/schedules/:scheduleId/tasks/:taskId', checkCreator, async (req, res) => {
  try {
    const task = await ScheduleTask.findOneAndUpdate(
      { _id: req.params.taskId, scheduleId: req.params.scheduleId },
      { $set: req.body },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/schedules/:scheduleId/tasks/:taskId
// @desc    Delete a task
router.delete('/schedules/:scheduleId/tasks/:taskId', checkCreator, async (req, res) => {
  try {
    const task = await ScheduleTask.findOneAndDelete({ _id: req.params.taskId, scheduleId: req.params.scheduleId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
