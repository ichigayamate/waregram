'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profile);
      Users.belongsTo(models.Roles);
    }
  }
  Users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate(user, options) {
        // hashing password
        const {password} = user;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(password, salt);
      }
    }
  });
  return Users;
};
