const express = require('express');
const router = express.Router();
const {
  createMember, getMembers, getMemberById, updateMember, deactivateMember, registerMember, deleteMember, getMyProfile
} = require('../controllers/memberController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/register', verifyToken, requireRole('admin'), registerMember);
router.post('/', verifyToken, requireRole('admin'), createMember);
router.get('/me', verifyToken, getMyProfile);
router.get('/', verifyToken, requireRole('admin'), getMembers);
router.get('/:id', verifyToken, getMemberById);
router.put('/:id', verifyToken, requireRole('admin'), updateMember);
router.put('/:id/deactivate', verifyToken, requireRole('admin'), deactivateMember);
router.delete('/:id', verifyToken, requireRole('admin'), deleteMember);

module.exports = router;