'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clothings', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => `clothing_${Math.floor(Math.random() * 1000000)}`,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      material: {
        type: Sequelize.ENUM,
        values: ["cotton","polyester","wool","denim","leather","nylon","spandex","silk","linen","velvet","tencel","satin","cashmere","other"],
        defaultValue: "other",
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true
      },
      numberOfWears: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      brand_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Brands",
            schema: "mycloset",
          },
          key: "id",
        },
      },
      clothing_image_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "ClothingImages",
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
    await queryInterface.dropTable('Clothings');
  }
};
