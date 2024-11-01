const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
const authRoutes = require('../routes/auth');
const linkRoutes = require('../routes/links');
const themeRoutes = require('../routes/themes');
const publicRoutes = require('../routes/public');
const clickRoutes = require('../routes/clicks');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://linksea.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Link Sea API is running' });
});

// API routes with explicit /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clicks', clickRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Export as serverless function
module.exports = app; 