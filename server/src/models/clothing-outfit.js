const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ClothingOutfit extends Model {
    static associate(models) {
      ClothingOutfit.belongsTo(models.Outfit, { 
        foreignKey: "outfit_id",
        onDelete: "CASCADE", });
      ClothingOutfit.belongsTo(models.Clothing, { 
        foreignKey: "clothing_id",
        onDelete: "CASCADE",
      });
    }
  }

  ClothingOutfit.init(
    {
      clothing_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "Clothing",
          key: "id",
        },
      },
      outfit_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "Outfit",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ClothingOutfit",
      tableName: "ClothingOutfits",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["clothing_id", "outfit_id"],
        },
      ],
    }
  );

  return ClothingOutfit;
};
