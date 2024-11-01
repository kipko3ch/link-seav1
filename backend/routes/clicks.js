const express = require('express');
const router = express.Router();
const { trackClick, getLinkStats } = require('../controllers/clickController');
const authMiddleware = require('../middleware/auth');

// Public route for tracking clicks
router.post('/:linkId', trackClick);

// Protected route for viewing stats
router.get('/:linkId/stats', authMiddleware, getLinkStats);

module.exports = router; 