'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Outfits', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => `outfit_${Math.floor(Math.random() * 1000000)}`,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ocassionType: {
        type: Sequelize.ENUM,
        values: ["formal","semi-formal","casual","professional","outdoor activities","home","cultural", "recreational", "celebratory"],
        defaultValue: "home",
      },
      numberOfWears: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isLiked: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      lastWornAt: {
        type: Sequelize.DATE,
        allowNull: true
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
      outfit_image_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "OutfitImages",
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
    await queryInterface.dropTable('Outfits');
  }
};
