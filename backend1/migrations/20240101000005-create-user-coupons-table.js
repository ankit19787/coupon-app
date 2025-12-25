'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_coupons', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      coupon_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint on user_id + coupon_id combination
    await queryInterface.addIndex('user_coupons', ['user_id', 'coupon_id'], {
      unique: true,
      name: 'user_coupons_user_coupon_unique'
    });

    // Add indexes for faster lookups
    await queryInterface.addIndex('user_coupons', ['user_id']);
    await queryInterface.addIndex('user_coupons', ['coupon_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_coupons');
  }
};

