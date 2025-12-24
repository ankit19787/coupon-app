const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const {
  createCouponValidation,
  updateCouponValidation,
  validateCouponValidation
} = require('../validators/couponValidator');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validate');

// Public routes (validate coupon - can be used by authenticated users)
router.post('/validate', authenticateToken, validateCouponValidation, handleValidationErrors, couponController.validateCoupon);
router.get('/code/:code', couponController.getCouponByCode);

// Protected routes (require authentication)
router.get('/stats', authenticateToken, isAdmin, couponController.getCouponStats);
router.get('/', authenticateToken, couponController.getAllCoupons);
router.get('/:id', authenticateToken, couponController.getCouponById);

// Admin only routes
router.post('/', authenticateToken, isAdmin, createCouponValidation, handleValidationErrors, couponController.createCoupon);
router.put('/:id', authenticateToken, isAdmin, updateCouponValidation, handleValidationErrors, couponController.updateCoupon);
router.delete('/:id', authenticateToken, isAdmin, couponController.deleteCoupon);
router.patch('/:id/toggle-status', authenticateToken, isAdmin, couponController.toggleCouponStatus);
router.post('/apply', authenticateToken, couponController.applyCoupon);

module.exports = router;

