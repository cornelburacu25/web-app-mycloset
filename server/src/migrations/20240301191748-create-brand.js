'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Brands",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => `brand_${Math.floor(Math.random() * 1000000)}`,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
      },
      {
        schema: "mycloset",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Brands");
  },
};