// Sequelize CLI configuration file
// This file is used by sequelize-cli for migrations
require('dotenv').config();

// Determine if SSL should be used
const dbSSL = (process.env.DB_SSL || '').toLowerCase().trim();
const useSSL = dbSSL === 'true';

const sslConfig = useSSL ? {
  require: true,
  rejectUnauthorized: false
} : false;

// Parse database configuration from POSTGRES_URL or individual variables
function getDbConfig() {
  if (process.env.POSTGRES_URL) {
    try {
      // Handle both postgres:// and postgresql:// URLs
      let connectionString = process.env.POSTGRES_URL;
      if (connectionString.startsWith('postgres://')) {
        connectionString = connectionString.replace('postgres://', 'postgresql://');
      }
      
      // Parse POSTGRES_URL
      const url = new URL(connectionString);
      const database = url.pathname.slice(1).split('?')[0]; // Remove leading '/' and query params
      
      return {
        username: decodeURIComponent(url.username || 'postgres'),
        password: decodeURIComponent(url.password || ''),
        database: database || 'coupon_db',
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: useSSL ? sslConfig : false
        }
      };
    } catch (error) {
      console.error('Error parsing POSTGRES_URL:', error.message);
      throw new Error('Invalid POSTGRES_URL format');
    }
  } else {
    // Use individual environment variables
    return {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'coupon_db',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: useSSL ? sslConfig : false
      }
    };
  }
}

const dbConfig = getDbConfig();

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};

