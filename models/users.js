'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
const {Profiles} = require("./index");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profiles);
      Users.belongsTo(models.Roles);
    }
  }
  Users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required'
        },
        notEmpty: {
          msg: 'Username is required'
        },
        len: {
          args: [5],
          msg: 'Username must be minimal 5 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        len: {
          args: [8],
          msg: 'Password must be minimal 8 characters'
        }
      }
    }
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
        user.RoleId = "user";
      },
    }
  });
  return Users;
};
