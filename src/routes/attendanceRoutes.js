const express = require('express');
const router = express.Router();
const {
  checkIn, getMemberAttendance, getAttendanceReport
} = require('../controllers/attendanceController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/checkin', verifyToken, checkIn);
router.get('/member/:memberId', verifyToken, getMemberAttendance);
router.get('/report', verifyToken, requireRole('admin'), getAttendanceReport);

module.exports = router;
