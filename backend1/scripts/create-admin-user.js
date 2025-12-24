require('dotenv').config();
const sequelize = require('../config/database');
const { User } = require('../models');

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    console.log('\nCreating admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists.');
    } else {
      // Create admin user
      const adminUser = await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

createAdminUser();

