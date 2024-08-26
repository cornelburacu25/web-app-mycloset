'use strict';

const { DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OutfitHistories', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => `outfit_history_${Math.floor(Math.random() * 1000000)}`,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Users",
            schema: "mycloset",
          },
          key: "id",
        },
      },
      wornAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
        allowNull: false
      },
      outfit_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Outfits",
            schema: "mycloset",
          },
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    },
    {
      schema: "mycloset",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OutfitHistories');
  }
};
