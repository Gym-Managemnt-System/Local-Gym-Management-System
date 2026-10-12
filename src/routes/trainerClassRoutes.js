const express = require('express');
const router = express.Router();
const {
  createTrainer, getTrainers, createClass, getClasses, enrollMember, registerTrainer,
  updateClass, deleteClass, getClassMembers
} = require('../controllers/trainerClassController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/trainers/register', verifyToken, requireRole('admin'), registerTrainer);
router.post('/trainers', verifyToken, requireRole('admin'), createTrainer);
router.get('/trainers', verifyToken, getTrainers);
router.post('/classes', verifyToken, requireRole('admin'), createClass);
router.get('/classes', verifyToken, getClasses);
router.put('/classes/:id', verifyToken, requireRole('admin'), updateClass);
router.delete('/classes/:id', verifyToken, requireRole('admin'), deleteClass);
router.get('/classes/:id/members', verifyToken, requireRole('admin'), getClassMembers);
router.post('/classes/enroll', verifyToken, enrollMember);

module.exports = router;