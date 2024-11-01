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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clicks', clickRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Link Sea API is running' });
});

// Export for serverless use
module.exports = app; 