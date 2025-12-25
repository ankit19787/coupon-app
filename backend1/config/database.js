// Load .env file - support custom .env file names like .env.12, .env.13, etc.
const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
const { Sequelize } = require('sequelize');

let sequelize;

// Determine if SSL should be used
// IMPORTANT: Only enable SSL if DB_SSL is explicitly set to 'true'
// If DB_SSL is false, undefined, or empty, SSL is disabled regardless of POSTGRES_URL SSL params
const dbSSL = (process.env.DB_SSL || '').toLowerCase().trim();
const useSSL = dbSSL === 'true';

// SSL configuration for self-signed certificates
// Only enable SSL if explicitly requested via DB_SSL=true
const sslConfig = useSSL ? {
  require: true,
  rejectUnauthorized: false // Accept self-signed certificates
} : false;

// Debug output in development
if (process.env.NODE_ENV === 'development') {
  console.log('Database SSL Configuration:');
  console.log('  DB_SSL env var:', process.env.DB_SSL || '(not set)');
  console.log('  useSSL:', useSSL);
  console.log('  sslConfig:', sslConfig ? 'enabled (rejectUnauthorized: false)' : 'disabled');
}

// Use POSTGRES_URL if provided, otherwise fall back to individual variables
if (process.env.POSTGRES_URL) {
  // Remove SSL parameters from URL if SSL is disabled
  let connectionUrl = process.env.POSTGRES_URL;
  if (!useSSL) {
    // Remove all SSL-related query parameters from URL
    connectionUrl = connectionUrl
      .replace(/[?&]sslmode=[^&]*/gi, '')
      .replace(/[?&]ssl=[^&]*/gi, '')
      .replace(/[?&]sslcert=[^&]*/gi, '')
      .replace(/[?&]sslkey=[^&]*/gi, '')
      .replace(/[?&]sslrootcert=[^&]*/gi, '')
      .replace(/[?&]sslcertfile=[^&]*/gi, '')
      .replace(/[?&]sslkeyfile=[^&]*/gi, '')
      .replace(/[?&]sslrootcertfile=[^&]*/gi, '');
    
    // Clean up double ? or & at start/end
    connectionUrl = connectionUrl.replace(/\?&/g, '?').replace(/&$/g, '').replace(/\?$/g, '');
  }
  
  const sequelizeConfig = {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      // Serverless-optimized pool settings
      max: process.env.VERCEL ? 1 : 5, // Serverless: 1 connection per function
      min: 0,
      acquire: 30000,
      idle: 10000,
      // Serverless: close idle connections faster
      evict: process.env.VERCEL ? 1000 : undefined
    },
    dialectOptions: {}
  };
  
  // Only set ssl in dialectOptions if SSL is enabled
  if (useSSL) {
    sequelizeConfig.dialectOptions.ssl = sslConfig;
  } else {
    // Explicitly set ssl to false to disable it
    sequelizeConfig.dialectOptions.ssl = false;
  }
  
  sequelize = new Sequelize(connectionUrl, sequelizeConfig);
} else {
  // Fallback to individual environment variables
  const sequelizeConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      // Serverless-optimized pool settings
      max: process.env.VERCEL ? 1 : 5, // Serverless: 1 connection per function
      min: 0,
      acquire: 30000,
      idle: 10000,
      // Serverless: close idle connections faster
      evict: process.env.VERCEL ? 1000 : undefined
    },
    dialectOptions: {}
  };
  
  // Only set ssl in dialectOptions if SSL is enabled
  if (useSSL) {
    sequelizeConfig.dialectOptions.ssl = sslConfig;
  } else {
    // Explicitly set ssl to false to disable it
    sequelizeConfig.dialectOptions.ssl = false;
  }
  
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    sequelizeConfig
  );
}

module.exports = sequelize;
