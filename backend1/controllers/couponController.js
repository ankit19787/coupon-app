const { Coupon, Website, User, UserCoupon } = require('../models');
const { Op } = require('sequelize');

exports.createCoupon = async (req, res) => {
  try {
    const couponData = { ...req.body };
    
    // Ensure code is uppercase
    if (couponData.code) {
      couponData.code = couponData.code.toUpperCase();
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
    await coupon.reload({ include: [{ model: Website }] });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      websiteId,
      isActive
    } = req.query;

    const where = {
      isDeleted: false,
      ...(websiteId && { websiteId }),
      ...(search && {
        code: { [Op.iLike]: `%${search}%` }
      }),
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };

    const { rows, count } = await Coupon.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (page - 1) * limit,
      include: [
        { model: Website },
        {
          model: User,
          as: 'users',
          through: { attributes: [] }, // Exclude junction table attributes
          attributes: ['id', 'name', 'email'] // Only include these user attributes
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id, {
      include: [{ model: Website }]
    });
    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon by code
exports.getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        isDeleted: false
      },
      include: [{ model: Website }]
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

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

    // Check user access (non-admin users must have the coupon assigned to them)
    if (userRole !== 'admin' && userId) {
      const userCoupon = await UserCoupon.findOne({
        where: {
          userId: userId,
          couponId: coupon.id
        }
      });

      if (!userCoupon) {
        return res.status(403).json({
          success: false,
          valid: false,
          message: 'You do not have access to this coupon'
        });
      }
    }

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id, {
      include: [{ model: Website }]
    });

    if (!coupon || coupon.isDeleted) {
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

    await coupon.update(updateData);
    await coupon.reload({ include: [{ model: Website }] });

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete coupon (soft delete)
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);

    if (!coupon || coupon.isDeleted) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle coupon active status
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id, {
      include: [{ model: Website }]
    });

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.update({ isActive: !coupon.isActive });
    await coupon.reload({ include: [{ model: Website }] });

    res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply coupon (increment usage count)
exports.applyCoupon = async (req, res) => {
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
    await coupon.reload();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon statistics
exports.getCouponStats = async (req, res) => {
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
    res.status(500).json({ success: false, message: error.message });
  }
};
