'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users);
      Profiles.hasMany(models.Items, {
        foreignKey: "PIC",
        sourceKey: 'id',
        as: 'Items',
      });
    }
  }
  Profiles.init({
    name: DataTypes.STRING,
    department: DataTypes.STRING,
    work_since: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};
