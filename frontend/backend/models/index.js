const sequelize = require('../config/database');
const Coupon = require('./Coupon');

const models = {
  Coupon,
  sequelize
};

module.exports = models;

