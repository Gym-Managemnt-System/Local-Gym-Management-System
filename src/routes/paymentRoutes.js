const express = require('express');
const router = express.Router();
const {
  createPayment, getMemberPayments, getPaymentsReport, getAllPayments, updatePayment, deletePayment, getPaymentById
} = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, requireRole('admin'), getAllPayments);
router.post('/', verifyToken, requireRole('admin'), createPayment);
router.get('/report', verifyToken, requireRole('admin'), getPaymentsReport);
router.get('/:id', verifyToken, requireRole('admin'), getPaymentById);
router.put('/:id', verifyToken, requireRole('admin'), updatePayment);
router.delete('/:id', verifyToken, requireRole('admin'), deletePayment);
router.get('/member/:memberId', verifyToken, getMemberPayments);

module.exports = router;
