// server/routes/applications.js
const express = require('express');
const Application = require('../models/Application');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const { attachUser, requireAuth, ensureTeacher } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// Student applies
router.post('/:activityId/apply', requireAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (!activity.isActive || new Date(activity.deadline) <= new Date()) {
      return res.status(400).json({ message: 'Deadline passed' });
    }
    const application = new Application({ student: req.user._id, activity: activity._id });
    try {
      await application.save();
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ message: 'Already applied' });
      throw err;
    }
    // Notify organizer
    await Notification.create({ user: activity.organizer, message: `${req.user.name} applied to ${activity.title}` });
    res.json({ message: 'Applied successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher lists applications
router.get('/:activityId', ensureTeacher, async (req, res) => {
  try {
    const applications = await Application.find({ activity: req.params.activityId }).populate('student', 'name email');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher updates application status
router.post('/:applicationId/status', ensureTeacher, async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.applicationId).populate('activity');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    app.status = status;
    await app.save();
    // Notify student
    await Notification.create({ user: app.student, message: `Your application for ${app.activity.title} is ${status}` });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
