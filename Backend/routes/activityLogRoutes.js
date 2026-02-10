const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/activityLogController');
// Check if you have an auth middleware, typically verifyToken
// Assuming 'authMiddleware' is the standard name or checking other routes
const { protect } = require('../middleware/authMiddleware'); 

// Get all logs (Protected)
router.get('/', protect, getLogs);

module.exports = router;
