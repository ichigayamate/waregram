'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Items.belongsTo(models.Profiles, {
        foreignKey: 'PIC',
        as: "Profile",
      });
      Items.belongsToMany(models.Categories, {
        through: models.ItemsCategories,
      });
    }
  }
  Items.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    estimatedDelivery: DataTypes.DATE,
    PIC: {
      type: DataTypes.UUID,
      references: {
        model: 'Profiles',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};
