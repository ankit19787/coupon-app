// Vercel serverless function entry point
// This exports the Express app as a serverless function handler

// Wrap in try-catch to handle initialization errors
let app;
try {
  app = require('../server');
} catch (error) {
  console.error('Failed to load server:', error);
  // Create a minimal error handler app
  const express = require('express');
  app = express();
  app.use((req, res) => {
    res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  });
}

// Export the app for Vercel
module.exports = app;

