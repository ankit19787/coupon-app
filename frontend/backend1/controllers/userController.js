const { User, Website, Coupon, UserWebsite, UserCoupon } = require('../models');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      })
    };

    const { rows, count } = await User.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (page - 1) * limit,
      attributes: { exclude: ['password'] },
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Website,
          as: 'websites',
          through: { attributes: [] }
        },
        {
          model: Coupon,
          as: 'coupons',
          through: { attributes: [] },
          include: [{ model: Website }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const user = await User.create({ email, password, name, role });
    const userData = user.toPublicJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    await user.update(updateData);
    const userData = user.toPublicJSON();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by setting isActive to false
    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign websites to user
exports.assignWebsites = async (req, res) => {
  try {
    const { id } = req.params;
    const { websiteIds } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove existing assignments
    await UserWebsite.destroy({ where: { userId: id } });

    // Add new assignments
    if (websiteIds && websiteIds.length > 0) {
      const assignments = websiteIds.map(websiteId => ({
        userId: id,
        websiteId
      }));
      await UserWebsite.bulkCreate(assignments);
    }

    // Fetch updated user with websites
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Website,
          as: 'websites',
          through: { attributes: [] }
        }
      ]
    });

    res.json({
      success: true,
      message: 'Websites assigned successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Assign coupons to user
exports.assignCoupons = async (req, res) => {
  try {
    const { id } = req.params;
    const { couponIds } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove existing assignments
    await UserCoupon.destroy({ where: { userId: id } });

    // Add new assignments
    if (couponIds && couponIds.length > 0) {
      const assignments = couponIds.map(couponId => ({
        userId: id,
        couponId
      }));
      await UserCoupon.bulkCreate(assignments);
    }

    // Fetch updated user with coupons
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Coupon,
          as: 'coupons',
          through: { attributes: [] },
          include: [{ model: Website }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Coupons assigned successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get user's assigned websites
exports.getUserWebsites = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Website,
          as: 'websites',
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.websites || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's assigned coupons
exports.getUserCoupons = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Coupon,
          as: 'coupons',
          through: { attributes: [] },
          include: [{ model: Website }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.coupons || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user coupon utilization statistics
exports.getUserCouponStatistics = async (req, res) => {
  try {
    // Get all users with their assigned coupons and coupon usage stats
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isActive'],
      include: [
        {
          model: Coupon,
          as: 'coupons',
          through: { attributes: [] },
          attributes: ['id', 'code', 'description', 'discount', 'discountType', 'usedCount', 'usageLimit', 'isActive'],
          include: [
            {
              model: Website,
              attributes: ['id', 'name', 'url']
            }
          ]
        }
      ],
      order: [['name', 'ASC']]
    });

    // Format the statistics
    const statistics = users.map(user => {
      const coupons = user.coupons || [];
      const totalAssignedCoupons = coupons.length;
      const activeCoupons = coupons.filter(c => c.isActive).length;
      const totalUsage = coupons.reduce((sum, coupon) => sum + (coupon.usedCount || 0), 0);

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        isActive: user.isActive,
        totalAssignedCoupons,
        activeCoupons,
        inactiveCoupons: totalAssignedCoupons - activeCoupons,
        totalCouponUsage: totalUsage,
        coupons: coupons.map(coupon => ({
          couponId: coupon.id,
          couponCode: coupon.code,
          couponDescription: coupon.description,
          discount: coupon.discount,
          discountType: coupon.discountType,
          usedCount: coupon.usedCount || 0,
          usageLimit: coupon.usageLimit,
          isActive: coupon.isActive,
          website: coupon.Website ? {
            id: coupon.Website.id,
            name: coupon.Website.name,
            url: coupon.Website.url
          } : null
        }))
      };
    });

    // Calculate summary statistics
    const summary = {
      totalUsers: users.length,
      totalActiveUsers: users.filter(u => u.isActive).length,
      totalAssignedCoupons: users.reduce((sum, user) => sum + (user.coupons?.length || 0), 0),
      totalCouponUsage: users.reduce((sum, user) => 
        sum + (user.coupons?.reduce((couponSum, coupon) => couponSum + (coupon.usedCount || 0), 0) || 0), 0
      ),
      usersWithCoupons: users.filter(u => (u.coupons?.length || 0) > 0).length
    };

    res.json({
      success: true,
      data: {
        summary,
        users: statistics
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
