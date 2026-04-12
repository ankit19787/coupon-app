// Load .env file - support custom .env file names like .env.12, .env.13, etc.
const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
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

// Middleware - CORS configuration
// Allow multiple origins for development and production
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:3000',
    'https://coupons-ochre.vercel.app'
  ];
  
  if (process.env.FRONTEND_URL) {
    // Support comma-separated list of origins
    const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    return [...new Set([...envOrigins, ...defaultOrigins])]; // Merge and remove duplicates
  }
  
  return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS. Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (doesn't require database)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  });
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

// Database connection - handle differently for serverless vs traditional server
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

if (isServerless) {
  // Serverless: don't block on database connection during initialization
  // Connection will be established on first request
  // This prevents cold start failures
  setImmediate(() => {
    sequelize.authenticate()
      .then(() => {
        console.log('Database connection established successfully (serverless).');
      })
      .catch((error) => {
        console.error('Database connection warning (serverless, non-blocking):', error.message);
        // Don't throw - connection will be retried on first request
      });
  });
} else {
  // Traditional server: authenticate, sync, and listen
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
}

module.exports = app;

