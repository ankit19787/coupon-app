const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Simple admin login for demo purposes
// In production, use proper authentication with database
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Demo credentials - replace with actual authentication
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign(
      { 
        id: 1, 
        email: 'admin@example.com', 
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: 1,
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

module.exports = router;

