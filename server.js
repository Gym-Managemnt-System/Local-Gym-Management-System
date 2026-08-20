const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const trainerClassRoutes = require('./src/routes/trainerClassRoutes');
const planRoutes = require('./src/routes/planRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gym Management API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', trainerClassRoutes); // /api/trainers, /api/classes
app.use('/api/plans', planRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gym Management backend running on http://localhost:${PORT}`);
});
