const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCoupon = sequelize.define('UserCoupon', {
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
  couponId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'coupons',
      key: 'id'
    }
  }
}, {
  tableName: 'user_coupons',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'coupon_id']
    }
  ]
});

module.exports = UserCoupon;

