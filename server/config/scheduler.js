// server/config/scheduler.js
const cron = require('node-cron');
const Activity = require('../models/Activity');

function startScheduler() {
  // Run every minute. Deactivate activities whose deadline passed.
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const res = await Activity.updateMany(
        { isActive: true, deadline: { $lte: now } },
        { $set: { isActive: false, removedAt: now } }
      );
      if (res.modifiedCount) {
        console.log(`🕒 Scheduler: deactivated ${res.modifiedCount} activities at ${now.toISOString()}`);
      }
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }, { scheduled: true });
  console.log('✅ Scheduler started (every minute)');
}

module.exports = startScheduler;
