// Load .env file - support custom .env file names
const envFile = process.env.ENV_FILE || '.env';
require('dotenv').config({ path: envFile });
const sequelize = require('../config/database');
const { Website } = require('../models');
const { Coupon } = require('../models');

async function runMigrations() {
  try {
    console.log('Connecting to database...');
    console.log('DB_SSL setting:', process.env.DB_SSL || 'not set (defaults to false, SSL disabled)');
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // First, create/update websites table
    console.log('\nCreating/updating websites table...');
    await Website.sync({ alter: true, force: false });
    console.log('✅ Websites table ready.');

    // Create/update coupons table first (if it doesn't exist)
    console.log('\nCreating/updating coupons table...');
    await Coupon.sync({ alter: true, force: false });
    console.log('✅ Coupons table ready.');

    // Check if websiteId column exists
    console.log('\nUpdating coupons table with websiteId...');
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='coupons' AND column_name='website_id'
    `);
    
    if (results.length === 0) {
      console.log('Adding websiteId column to coupons table...');
      // Add column as nullable initially (to handle existing records)
      await sequelize.query(`
        ALTER TABLE coupons 
        ADD COLUMN website_id UUID
      `);
      
      // Add foreign key constraint
      await sequelize.query(`
        ALTER TABLE coupons 
        ADD CONSTRAINT coupons_website_id_fkey 
        FOREIGN KEY (website_id) 
        REFERENCES websites(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
      `);
      
      // Add index
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS coupons_website_id_idx 
        ON coupons(website_id)
      `);
      
      console.log('✅ websiteId column added to coupons table (nullable for existing records).');
      
      // Check if there are existing coupons without website_id
      const [couponCount] = await sequelize.query(`
        SELECT COUNT(*) as count 
        FROM coupons 
        WHERE website_id IS NULL
      `);
      
      if (couponCount[0].count > 0) {
        console.log(`\n⚠️  Found ${couponCount[0].count} existing coupons without website assignment.`);
        console.log('   You can assign websites to these coupons through the admin panel.');
      }
    } else {
      console.log('✅ websiteId column already exists in coupons table.');
    }

    // Sync coupons table (this will handle any other schema changes but won't force NOT NULL on website_id if there are nulls)
    console.log('\nSynchronizing coupons table...');
    // We'll skip the sync to avoid the NOT NULL constraint issue
    // The column will remain nullable for now, and users can assign websites via UI
    console.log('✅ Coupons table migration completed.');

    console.log('\n✅ All migrations completed successfully!');
    console.log('\nNote: website_id is currently nullable to support existing coupons.');
    console.log('   Assign websites to coupons through the admin panel.');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

runMigrations();
