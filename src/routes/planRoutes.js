const express = require('express');
const router = express.Router();
const { createPlan, getPlans, updatePlan, archivePlan } = require('../controllers/planController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('admin'), createPlan);
router.get('/', verifyToken, getPlans);
router.put('/:id', verifyToken, requireRole('admin'), updatePlan);
router.put('/:id/archive', verifyToken, requireRole('admin'), archivePlan);

module.exports = router;