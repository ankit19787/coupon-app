const { body } = require('express-validator');

const createUserValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user"')
];

const updateUserValidation = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user"'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const assignWebsitesValidation = [
  body('websiteIds')
    .optional()
    .isArray()
    .withMessage('websiteIds must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const isValid = value.every(id => typeof id === 'string' && id.length > 0);
        if (!isValid) {
          throw new Error('All website IDs must be valid strings');
        }
      }
      return true;
    })
];

const assignCouponsValidation = [
  body('couponIds')
    .optional()
    .isArray()
    .withMessage('couponIds must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const isValid = value.every(id => typeof id === 'string' && id.length > 0);
        if (!isValid) {
          throw new Error('All coupon IDs must be valid strings');
        }
      }
      return true;
    })
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  assignWebsitesValidation,
  assignCouponsValidation
};

