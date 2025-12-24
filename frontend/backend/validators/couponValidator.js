const { body } = require('express-validator');

const createCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Coupon code must be between 3 and 50 characters')
    .matches(/^[A-Za-z0-9-_]+$/)
    .withMessage('Coupon code can only contain letters, numbers, hyphens, and underscores')
    .customSanitizer(value => value ? value.toUpperCase() : value),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('discount')
    .notEmpty()
    .withMessage('Discount is required')
    .isFloat({ min: 0 })
    .withMessage('Discount must be a positive number'),
  
  body('discountType')
    .notEmpty()
    .withMessage('Discount type is required')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "fixed"'),
  
  body('minPurchaseAmount')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty for optional fields
      }
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Minimum purchase amount must be a positive number');
      }
      return true;
    }),
  
  body('maxDiscountAmount')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty for optional fields
      }
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Maximum discount amount must be a positive number');
      }
      return true;
    }),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('usageLimit')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty for optional fields
      }
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) {
        throw new Error('Usage limit must be a non-negative integer');
      }
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const updateCouponValidation = [
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Coupon code must be between 3 and 50 characters')
    .matches(/^[A-Za-z0-9-_]+$/)
    .withMessage('Coupon code can only contain letters, numbers, hyphens, and underscores')
    .customSanitizer(value => value ? value.toUpperCase() : value),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a positive number'),
  
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "fixed"'),
  
  body('minPurchaseAmount')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Minimum purchase amount must be a positive number');
      }
      return true;
    }),
  
  body('maxDiscountAmount')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Maximum discount amount must be a positive number');
      }
      return true;
    }),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('usageLimit')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) {
        throw new Error('Usage limit must be a non-negative integer');
      }
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const validateCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number')
];

module.exports = {
  createCouponValidation,
  updateCouponValidation,
  validateCouponValidation
};
