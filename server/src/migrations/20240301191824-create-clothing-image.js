'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClothingImages', {
      id:{
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        defaultValue: () => `clothingimage_${Math.floor(Math.random() * 1000000)}`,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ClothingImages');
  }
};