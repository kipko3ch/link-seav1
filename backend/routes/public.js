const express = require('express');
const router = express.Router();
const { getPublicPage } = require('../controllers/publicController');

router.get('/:username', getPublicPage);

module.exports = router; 