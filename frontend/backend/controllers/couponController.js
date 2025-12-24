const { Coupon } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all coupons with pagination and filters
exports.getAllCoupons = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      discountType,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isDeleted: false };

    // Search filter
    if (search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Active status filter
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Discount type filter
    if (discountType) {
      where.discountType = discountType;
    }

    // Date range filter
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) {
        where.startDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.endDate = { [Op.lte]: new Date(endDate) };
      }
    }

    const { count, rows } = await Coupon.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single coupon by ID
exports.getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      where: { id, isDeleted: false }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Get coupon by code
exports.getCouponByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        isDeleted: false
      }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Validate coupon
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    const validation = await Coupon.validateByCode(code);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: validation.message
      });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        isDeleted: false
      }
    });

    // Check minimum purchase amount
    if (amount && coupon.minPurchaseAmount > 0) {
      if (amount < coupon.minPurchaseAmount) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Minimum purchase amount of ${coupon.minPurchaseAmount} is required`
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (amount) {
      discountAmount = Coupon.calculateDiscount(
        amount,
        coupon.discount,
        coupon.discountType,
        coupon.maxDiscountAmount
      );
    }

    res.json({
      success: true,
      valid: true,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount: coupon.discount,
          discountType: coupon.discountType,
          description: coupon.description
        },
        discountAmount,
        finalAmount: amount ? amount - discountAmount : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new coupon
exports.createCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const couponData = { ...req.body };

    // Ensure code is uppercase (validation already does this, but double-check)
    if (couponData.code) {
      couponData.code = couponData.code.toUpperCase();
    }

    // Convert empty strings to null for optional fields
    if (couponData.minPurchaseAmount === '' || couponData.minPurchaseAmount === null) {
      couponData.minPurchaseAmount = null;
    } else if (couponData.minPurchaseAmount !== undefined) {
      couponData.minPurchaseAmount = parseFloat(couponData.minPurchaseAmount);
    }

    if (couponData.maxDiscountAmount === '' || couponData.maxDiscountAmount === null) {
      couponData.maxDiscountAmount = null;
    } else if (couponData.maxDiscountAmount !== undefined) {
      couponData.maxDiscountAmount = parseFloat(couponData.maxDiscountAmount);
    }

    if (couponData.usageLimit === '' || couponData.usageLimit === null) {
      couponData.usageLimit = null;
    } else if (couponData.usageLimit !== undefined) {
      couponData.usageLimit = parseInt(couponData.usageLimit, 10);
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({
      where: { code: couponData.code, isDeleted: false }
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Update coupon
exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const coupon = await Coupon.findOne({
      where: { id, isDeleted: false }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If code is being updated, check for duplicates
    if (updateData.code && updateData.code !== coupon.code) {
      // Ensure code is uppercase
      updateData.code = updateData.code.toUpperCase();
      const existingCoupon = await Coupon.findOne({
        where: {
          code: updateData.code,
          id: { [Op.ne]: id },
          isDeleted: false
        }
      });

      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    // Convert empty strings to null for optional fields
    if (updateData.minPurchaseAmount === '' || updateData.minPurchaseAmount === null) {
      updateData.minPurchaseAmount = null;
    } else if (updateData.minPurchaseAmount !== undefined) {
      updateData.minPurchaseAmount = parseFloat(updateData.minPurchaseAmount);
    }

    if (updateData.maxDiscountAmount === '' || updateData.maxDiscountAmount === null) {
      updateData.maxDiscountAmount = null;
    } else if (updateData.maxDiscountAmount !== undefined) {
      updateData.maxDiscountAmount = parseFloat(updateData.maxDiscountAmount);
    }

    if (updateData.usageLimit === '' || updateData.usageLimit === null) {
      updateData.usageLimit = null;
    } else if (updateData.usageLimit !== undefined) {
      updateData.usageLimit = parseInt(updateData.usageLimit, 10);
    }

    await coupon.update(updateData);
    await coupon.reload();

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Delete coupon (soft delete)
exports.deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      where: { id, isDeleted: false }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.update({ isDeleted: true, isActive: false });

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle coupon active status
exports.toggleCouponStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      where: { id, isDeleted: false }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.update({ isActive: !coupon.isActive });

    res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Apply coupon (increment usage count)
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        isDeleted: false
      }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    const validation = coupon.isValid();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Increment usage count
    await coupon.increment('usedCount');

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// Get coupon statistics
exports.getCouponStats = async (req, res, next) => {
  try {
    const totalCoupons = await Coupon.count({
      where: { isDeleted: false }
    });

    const activeCoupons = await Coupon.count({
      where: { isActive: true, isDeleted: false }
    });

    const expiredCoupons = await Coupon.count({
      where: {
        endDate: { [Op.lt]: new Date() },
        isDeleted: false
      }
    });

    const totalUsage = await Coupon.sum('usedCount', {
      where: { isDeleted: false }
    });

    res.json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalUsage: totalUsage || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

