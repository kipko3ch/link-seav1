require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const themeRoutes = require('./routes/themes');
const publicRoutes = require('./routes/public');
const clickRoutes = require('./routes/clicks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://linksea.vercel.app',
    'http://localhost:3000',
    'https://link-sea.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Link Sea API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clicks', clickRoutes);

// Catch-all route for API
app.get('/api', (req, res) => {
  res.json({ message: 'Link Sea API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 