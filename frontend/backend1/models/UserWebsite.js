const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserWebsite = sequelize.define('UserWebsite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  websiteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'websites',
      key: 'id'
    }
  }
}, {
  tableName: 'user_websites',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'website_id']
    }
  ]
});

module.exports = UserWebsite;

