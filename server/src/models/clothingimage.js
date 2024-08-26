'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class ClothingImage extends Model {

    static associate(models) {
    
    }
  }
  ClothingImage.init(
    {
      id:{
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        defaultValue: () => `clothingimage_${Math.floor(Math.random() * 1000000)}`,
      },
      url:
      {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label:{
      type: DataTypes.STRING,
      validate: {
        isIn: [['pants', 't-shirt', 'skirt', 'dress', 'shorts', 'shoes', 'hat' , 'longsleeve' , 'outwear' ,'shirt']],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ClothingImage',
    tableName: "ClothingImages",
    schema: 'mycloset',
    timestamps: false
  });
  return ClothingImage;
};