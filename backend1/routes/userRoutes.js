const router = require('express').Router();
const controller = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
  createUserValidation,
  updateUserValidation,
  assignWebsitesValidation,
  assignCouponsValidation
} = require('../validators/userValidator');
const handleValidationErrors = require('../middleware/validate');

// All user routes require admin access
router.get('/', authenticateToken, isAdmin, controller.getAllUsers);
router.get('/:id', authenticateToken, isAdmin, controller.getUserById);
router.post('/', authenticateToken, isAdmin, createUserValidation, handleValidationErrors, controller.createUser);
router.put('/:id', authenticateToken, isAdmin, updateUserValidation, handleValidationErrors, controller.updateUser);
router.delete('/:id', authenticateToken, isAdmin, controller.deleteUser);

// Assignment routes
router.post('/:id/websites', authenticateToken, isAdmin, assignWebsitesValidation, handleValidationErrors, controller.assignWebsites);
router.post('/:id/coupons', authenticateToken, isAdmin, assignCouponsValidation, handleValidationErrors, controller.assignCoupons);
router.get('/:id/websites', authenticateToken, isAdmin, controller.getUserWebsites);
router.get('/:id/coupons', authenticateToken, isAdmin, controller.getUserCoupons);

// Statistics route (must be before /:id routes)
router.get('/statistics/coupon-usage', authenticateToken, isAdmin, controller.getUserCouponStatistics);

module.exports = router;

