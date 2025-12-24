const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Coupon code cannot be empty'
      },
      len: {
        args: [3, 50],
        msg: 'Coupon code must be between 3 and 50 characters'
      }
    }
  },
  websiteId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow null for existing records, can be made required later
    references: {
      model: 'websites',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Discount cannot be negative'
      }
    }
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage',
    validate: {
      isIn: {
        args: [['percentage', 'fixed']],
        msg: 'Discount type must be either percentage or fixed'
      }
    }
  },
  minPurchaseAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Minimum purchase amount cannot be negative'
      }
    }
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Maximum discount amount cannot be negative'
      }
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Start date must be a valid date'
      }
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'End date must be a valid date'
      },
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: {
        args: [0],
        msg: 'Usage limit cannot be negative'
      }
    }
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Used count cannot be negative'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['is_active', 'is_deleted']
    },
    {
      fields: ['start_date', 'end_date']
    }
  ],
  // PostgreSQL specific settings
  dialectOptions: {
    charset: 'utf8'
  }
});

// Instance method to check if coupon is valid
Coupon.prototype.isValid = function() {
  const now = new Date();
  
  if (!this.isActive || this.isDeleted) {
    return { valid: false, message: 'Coupon is not active' };
  }
  
  if (now < this.startDate) {
    return { valid: false, message: 'Coupon has not started yet' };
  }
  
  if (now > this.endDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit has been reached' };
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Static method to validate coupon by code
Coupon.validateByCode = async function(code) {
  const coupon = await this.findOne({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      isDeleted: false
    }
  });
  
  if (!coupon) {
    return { valid: false, message: 'Coupon not found' };
  }
  
  return coupon.isValid();
};

// Static method to calculate discount
Coupon.calculateDiscount = function(amount, discount, discountType, maxDiscount = null) {
  let discountAmount = 0;
  
  if (discountType === 'percentage') {
    discountAmount = (amount * discount) / 100;
    if (maxDiscount !== null && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  } else {
    discountAmount = discount;
  }
  
  return Math.min(discountAmount, amount);
};

// Hook to uppercase coupon code
Coupon.beforeCreate((coupon) => {
  if (coupon.code) {
    coupon.code = coupon.code.toUpperCase();
  }
});

Coupon.beforeUpdate((coupon) => {
  if (coupon.code && coupon.changed('code')) {
    coupon.code = coupon.code.toUpperCase();
  }
});

module.exports = Coupon;

