
const sequelize = require('../config/database');
const Coupon = require('./Coupon');
const Website = require('./Website');
const User = require('./User');
const UserWebsite = require('./UserWebsite');
const UserCoupon = require('./UserCoupon');

// Website - Coupon relationship
Website.hasMany(Coupon, { foreignKey: 'websiteId' });
Coupon.belongsTo(Website, { foreignKey: 'websiteId' });

// User - Website relationship (many-to-many)
User.belongsToMany(Website, {
  through: UserWebsite,
  foreignKey: 'userId',
  otherKey: 'websiteId',
  as: 'websites'
});
Website.belongsToMany(User, {
  through: UserWebsite,
  foreignKey: 'websiteId',
  otherKey: 'userId',
  as: 'users'
});

// User - Coupon relationship (many-to-many)
User.belongsToMany(Coupon, {
  through: UserCoupon,
  foreignKey: 'userId',
  otherKey: 'couponId',
  as: 'coupons'
});
Coupon.belongsToMany(User, {
  through: UserCoupon,
  foreignKey: 'couponId',
  otherKey: 'userId',
  as: 'users'
});

const models = {
  Coupon,
  Website,
  User,
  UserWebsite,
  UserCoupon,
  sequelize
};

module.exports = models;
