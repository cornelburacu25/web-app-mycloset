'use strict';

/** @type {import('sequelize-cli').Migration} */
  module.exports = {
    up: async (queryInterface) => {
      await queryInterface.createSchema('mycloset');
    },
  
    down: async (queryInterface,
                 Sequelize) => {
      await queryInterface.dropSchema('mycloset');
    }
  };

