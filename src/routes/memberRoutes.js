const express = require('express');
const router = express.Router();
const {
  createMember, getMembers, getMemberById, updateMember, deactivateMember
} = require('../controllers/memberController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('admin'), createMember);
router.get('/', verifyToken, requireRole('admin'), getMembers);
router.get('/:id', verifyToken, getMemberById);
router.put('/:id', verifyToken, requireRole('admin'), updateMember);
router.delete('/:id', verifyToken, requireRole('admin'), deactivateMember);

module.exports = router;
