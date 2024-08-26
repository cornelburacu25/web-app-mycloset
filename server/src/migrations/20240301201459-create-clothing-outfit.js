'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "ClothingOutfits",
      {
        clothing_id: {
          type: Sequelize.STRING,
          references: {
            model: {
              tableName: "Clothings",
              schema: "mycloset",
            },
            key: "id",
          },
          onDelete: "CASCADE",
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
          onDelete: "CASCADE",
        },
      },
      {
        schema: "mycloset",
        primaryKey: ["clothing_id", "outfit_id"],
        uniqueKeys: {
          unique_clothing_outfit: {
            fields: ["clothing_id", "outfit_id"],
          },
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ClothingOutfits");
  },
};
