const express = require('express');
const router = express.Router();
const {
  createTrainer, getTrainers, createClass, getClasses, enrollMember
} = require('../controllers/trainerClassController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/trainers', verifyToken, requireRole('admin'), createTrainer);
router.get('/trainers', verifyToken, getTrainers);
router.post('/classes', verifyToken, requireRole('admin'), createClass);
router.get('/classes', verifyToken, getClasses);
router.post('/classes/enroll', verifyToken, enrollMember);

module.exports = router;
