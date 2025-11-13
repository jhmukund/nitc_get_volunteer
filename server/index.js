// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const startScheduler = require('./config/scheduler');

const authRoutes = require('./routes/auth');
const activitiesRoutes = require('./routes/activities');
const applicationsRoutes = require('./routes/applications');
const notificationsRoutes = require('./routes/notifications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  startScheduler();
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
});
