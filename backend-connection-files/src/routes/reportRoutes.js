const express = require('express');
const router = express.Router();
const { generateTransferReport } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

// FR-9: GET /api/reports/transfer/:memberId -> downloads a PDF
router.get('/transfer/:memberId', verifyToken, generateTransferReport);

module.exports = router;
