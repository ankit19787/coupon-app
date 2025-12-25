/**
 * Test Database Connection Script
 * Run this to verify your database connection before starting the server
 * Usage: node scripts/test-db-connection.js
 */

// Load .env file - support custom .env file names
const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
const sequelize = require('../config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Configuration:');
    
    if (process.env.POSTGRES_URL) {
      // Mask password in URL for display
      const maskedUrl = process.env.POSTGRES_URL.replace(/:\/\/[^:]+:[^@]+@/, '://****:****@');
      console.log(`  Connection String: ${maskedUrl}`);
    } else {
      console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`  Port: ${process.env.DB_PORT || 5432}`);
      console.log(`  Database: ${process.env.DB_NAME || 'coupon_db'}`);
      console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
    }
    console.log(`  Dialect: PostgreSQL`);
    console.log('');

    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test query - PostgreSQL uses current_database()
    const [results] = await sequelize.query('SELECT current_database() as current_db');
    console.log(`✅ Current database: ${results[0].current_db}`);
    
    // Get PostgreSQL version
    const [dbInfo] = await sequelize.query('SELECT version() as version');
    console.log(`✅ PostgreSQL version: ${dbInfo[0].version.split(',')[0]}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('');
    console.error('Error details:');
    console.error(error.message);
    console.error('');
    
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    
    console.error('');
    console.error('Troubleshooting:');
    if (process.env.POSTGRES_URL) {
      console.error('1. Verify POSTGRES_URL format: postgresql://user:password@host:port/database');
      console.error('2. Check if POSTGRES_URL contains correct credentials');
    } else {
      console.error('1. Verify database credentials in .env file');
      console.error('2. Check individual DB_* variables (DB_HOST, DB_PORT, etc.)');
    }
    console.error('3. Check if PostgreSQL is running');
    console.error('4. Ensure database exists');
    console.error('5. Check if port is correct (default: 5432)');
    console.error('6. Verify network/firewall settings');
    
    process.exit(1);
  }
}

testConnection();
