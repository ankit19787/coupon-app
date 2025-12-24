'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('coupons');
    
    if (!tableDescription.websiteId) {
      await queryInterface.addColumn('coupons', 'websiteId', {
        type: Sequelize.UUID,
        allowNull: true, // Allow null initially for existing records
        references: {
          model: 'websites',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      // Create index for better query performance
      await queryInterface.addIndex('coupons', ['websiteId'], {
        name: 'coupons_website_id_idx'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('coupons', 'coupons_website_id_idx');
    await queryInterface.removeColumn('coupons', 'websiteId');
  }
};

