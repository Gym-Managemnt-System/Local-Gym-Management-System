const express = require('express');
const router = express.Router();
const { createPlan, getPlans } = require('../controllers/planController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('admin'), createPlan);
router.get('/', verifyToken, getPlans);

module.exports = router;
