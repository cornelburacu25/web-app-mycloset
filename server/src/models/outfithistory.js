const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class OutfitHistory extends Model {
    static associate(models) {
        OutfitHistory.belongsTo(models.Outfit, {
            foreignKey: "outfit_id"
        });
        OutfitHistory.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
  OutfitHistory.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true, 
        unique: true,
        defaultValue: () => `outfit_history_${Math.floor(Math.random() * 1000000)}`
      },
      wornAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      outfit_id: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.INTEGER
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
    modelName: 'OutfitHistory',
    tableName: "OutfitHistories",
    schema: 'mycloset',
    timestamps: false,
   }
  );
  return OutfitHistory;
};