const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Outfit extends Model {
    static associate(models) {
        Outfit.belongsTo(models.OutfitImage, {
            foreignKey: "outfit_image_id"
        });
        Outfit.belongsTo(models.User, { foreignKey: 'user_id' });
        Outfit.belongsToMany(models.Clothing, {
          through: models.ClothingOutfit,
          foreignKey: 'outfit_id',
          as: 'Clothings'
        });
  }
}
  Outfit.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true, 
        unique: true,
        defaultValue: () => `outfit_${Math.floor(Math.random() * 1000000)}`
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: {msg: 'Name is required'},
          notEmpty: {msg: "Name can't be empty"},
          len: {
            args: [0, 30],
            msg: 'Name must be maximum 30 characters'
          }
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
          len: {
            args: [0, 150],
            msg: 'Description must be maximum 150 characters'
          }
        }
      },
      ocassionType: {
        type: DataTypes.ENUM,
        values: ["formal","semi-formal","casual","professional","outdoor activities","home","cultural", "recreational", "celebratory"],
        defaultValue: "home",
      },
      numberOfWears: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isLiked: {
        type: DataTypes.BOOLEAN
      },
      lastWornAt: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      outfit_image_id: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
  }, {
    sequelize,
    modelName: 'Outfit',
    tableName: "Outfits",
    schema: 'mycloset',
    timestamps: false
   }
  );
  return Outfit;
};