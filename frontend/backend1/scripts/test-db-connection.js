/**
 * Test Database Connection Script
 * Run this to verify your database connection before starting the server
 * Usage: node scripts/test-db-connection.js
 */

require('dotenv').config();
const sequelize = require('../config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Configuration:');
    console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.DB_PORT || 5432}`);
    console.log(`  Database: ${process.env.DB_NAME || 'coupon_db'}`);
    console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
    console.log(`  Dialect: PostgreSQL`);
    console.log('');

    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test query
    const [results] = await sequelize.query('SELECT DATABASE() as current_db');
    console.log(`✅ Current database: ${results[0].current_db}`);
    
    // Check if coupon_db exists
    const [databases] = await sequelize.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    } else {
      console.log(`⚠️  Database '${process.env.DB_NAME}' does not exist`);
      console.log('   Create it with: CREATE DATABASE coupon_db;');
    }
    
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
    console.error('1. Check if PostgreSQL is running (service or process)');
    console.error('2. Verify database credentials in .env file');
    console.error('3. Ensure database exists: CREATE DATABASE coupon_db;');
    console.error('4. Check if port is correct (default: 5432)');
    console.error('5. Verify PostgreSQL service is started');
    console.error('6. See POSTGRESQL_SETUP.md for detailed setup guide');
    
    process.exit(1);
  }
}

testConnection();

