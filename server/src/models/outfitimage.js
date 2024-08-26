'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class OutfitImage extends Model {

    static associate(models) {
      
    }
  }
  OutfitImage.init(
    {
      id:{
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        defaultValue: () => `outfitimage_${Math.floor(Math.random() * 1000000)}`,
      },
      url:
      {
      type: DataTypes.STRING,
      allowNull: false
    },
    label:{
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'OutfitImage',
    tableName: "OutfitImages",
    schema: 'mycloset',
    timestamps: false
  });
  return OutfitImage;
};