const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Brand extends Model {}

  Brand.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        defaultValue: () => `brand_${Math.floor(Math.random() * 1000000)}`,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            len: {
              args: [0, 50],
              msg: 'Name must be maximum 50 characters'
            }
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
    },
    {
      sequelize,
      modelName: "Brand",
      tableName: "Brands",
      timestamps: false,
    }
  );

  return Brand;
};
