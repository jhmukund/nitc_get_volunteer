// server/routes/notifications.js
const express = require('express');
const Notification = require('../models/Notification');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// Get notifications
router.get('/', requireAuth, async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark read
router.post('/:id/read', requireAuth, async (req, res) => {
  try {
    const note = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
