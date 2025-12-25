'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_websites', {
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
      website_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'websites',
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

    // Add unique constraint on user_id + website_id combination
    await queryInterface.addIndex('user_websites', ['user_id', 'website_id'], {
      unique: true,
      name: 'user_websites_user_website_unique'
    });

    // Add indexes for faster lookups
    await queryInterface.addIndex('user_websites', ['user_id']);
    await queryInterface.addIndex('user_websites', ['website_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_websites');
  }
};

