const express = require('express');
const router = express.Router();
const { getLinks, createLink, updateLink, deleteLink } = require('../controllers/linkController');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get all links
router.get('/', getLinks);

// Create a new link
router.post('/', createLink);

// Update a link
router.put('/:id', updateLink);

// Delete a link
router.delete('/:id', deleteLink);

module.exports = router; 