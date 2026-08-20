const express = require('express');
const router = express.Router();
const {
  createPayment, getMemberPayments, getPaymentsReport
} = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('admin'), createPayment);
router.get('/member/:memberId', verifyToken, getMemberPayments);
router.get('/report', verifyToken, requireRole('admin'), getPaymentsReport);

module.exports = router;
