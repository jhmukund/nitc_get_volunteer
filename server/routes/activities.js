// server/routes/activities.js
const express = require('express');
const Activity = require('../models/Activity');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { attachUser, ensureTeacher } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// List activities (query ?active=true)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (req.user && req.user.role === 'teacher') {
      filter.organizer = req.user._id;
    }
    if (active === 'true') {
      filter.isActive = true;
    }
    const activities = await Activity.find(filter).populate('organizer', 'name email');
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher dashboard: only their activities
router.get('/mine', ensureTeacher, async (req, res) => {
  try {
    const activities = await Activity.find({ organizer: req.user._id })
      .populate('organizer', 'name email');
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create
router.post('/', ensureTeacher, async (req, res) => {
  try {
    const data = req.body;
    data.organizer = req.user._id;
    data.isActive = new Date(data.deadline) > new Date();
    const activity = await Activity.create(data);
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Extend deadline
router.post('/:id/extend-deadline', ensureTeacher, async (req, res) => {
  try {
    const { newDeadline } = req.body;
    if (!newDeadline) return res.status(400).json({ message: 'newDeadline required' });
    const nd = new Date(newDeadline);
    if (isNaN(nd)) return res.status(400).json({ message: 'Invalid date' });
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can modify this activity' });
    }
    activity.deadline = nd;
    activity.isActive = nd > new Date();
    activity.removedAt = activity.isActive ? null : new Date();
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete activity (teacher) — remove activity, its applications
router.delete('/:id', ensureTeacher, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can delete this activity' });
    }
    await Application.deleteMany({ activity: activity._id });
    // remove notifications related to this activity: optional
    await Notification.deleteMany({ message: new RegExp(activity._id.toString()) }).catch(()=>{});
    await activity.deleteOne();
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
