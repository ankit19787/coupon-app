require('dotenv').config();
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const sequelize = require('../config/database');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    tableName: 'SequelizeMeta'
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
    path: path.join(__dirname, '../migrations'),
    pattern: /\.js$/
  }
});

(async () => {
  try {
    console.log('Running migrations...');
    await umzug.up();
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
})();

