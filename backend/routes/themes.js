const express = require('express');
const router = express.Router();
const { 
  getThemes, 
  createTheme, 
  updateTheme, 
  deleteTheme,
  getActiveTheme 
} = require('../controllers/themeController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getThemes);
router.get('/active', getActiveTheme);
router.post('/', createTheme);
router.put('/:id', updateTheme);
router.delete('/:id', deleteTheme);

module.exports = router; 