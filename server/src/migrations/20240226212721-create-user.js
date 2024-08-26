'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.ENUM,
      values: ["male","female","other"],
      defaultValue: "other",
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,        
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: true,
  },
    isActivated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
  }, {
    schema: 'mycloset'
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users', { schema: 'mycloset' });
  }
};
