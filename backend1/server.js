require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const couponRoutes = require('./routes/couponRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    
    // Sync database (creates tables if they don't exist)
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

module.exports = app;

