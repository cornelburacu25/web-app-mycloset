const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Clothing extends Model {
    static associate(models) {
      Clothing.belongsTo(models.ClothingImage, {
        foreignKey: "clothing_image_id"
    });
    Clothing.belongsTo(models.User, { foreignKey: 'user_id' });
    Clothing.belongsTo(models.Brand, { foreignKey: 'brand_id'});
    Clothing.belongsToMany(models.Outfit, {
      through: models.ClothingOutfit,
      foreignKey: 'clothing_id',
      as: 'Outfits'
    });
  }
}
  Clothing.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true, 
        unique: true,
        defaultValue: () => `clothing_${Math.floor(Math.random() * 1000000)}`
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Title is required' },
          notEmpty: { msg: "Title can't be empty" },
          len: {
            args: [1, 30],
            msg: 'Title must be between 1 and 30 characters'
          }
        }
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['pants', 't-shirt', 'skirt', 'dress', 'shorts', 'shoes', 'hat' , 'longsleeve' , 'outwear' ,'shirt']],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
          len: {
            args: [0, 100],
            msg: 'Description must be maximum 100 characters'
          },
        },
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          len: {
            args: [0, 15],
            msg: 'Color must be maximum 15 characters'
          },
        },
      },
      material: {
        type: DataTypes.ENUM,
        values: ["cotton","polyester","wool","denim","leather","nylon","spandex","silk","linen","viscose","satin","cashmere","flannel", "suede", "rubber", "other"],
        defaultValue: "other",
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          customValidation(value) {
            if (value !== null && !['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(value) && (isNaN(parseInt(value)) || parseInt(value) < 20 || parseInt(value) > 60)) {
              throw new Error('Size must be one of: xxs, xs, s, m, l, xl, xxl, or a number between 20 and 60.');
            }
          }
        }
      },
      brand_id:{
        type: DataTypes.STRING,
      },
      numberOfWears: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      lastWornAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      clothing_image_id: {
        type: DataTypes.STRING,
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
    modelName: 'Clothing',
    tableName: "Clothings",
    schema: 'mycloset',
    timestamps: false
   }
  );
  return Clothing;
};