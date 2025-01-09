'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");
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

    get formattedDate() {
      return dayjs(this.estimatedDelivery).format("dddd, DD MMMM YYYY")
    }

    checkStatus() {
      const now = dayjs();
      const estimated = dayjs(this.estimatedDelivery);
      if (now.isAfter(estimated)) {
        return "Late";
      } else if (now.isBefore(estimated)) {
        return "On Time";
      } else {
        return "Delivered";
      }
    }

    get status() {
      return this.checkStatus();
    }

    static async getAllStatus(userId) {
      const where = {};
      if (userId) {
        where.PIC = userId;
      }
      return await this.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "total"],
          [sequelize.fn("SUM", sequelize.literal(`CASE WHEN "estimatedDelivery" < NOW() THEN 1 ELSE 0 END`)), "late"],
          [sequelize.fn("SUM", sequelize.literal(`CASE WHEN "estimatedDelivery" > NOW() THEN 1 ELSE 0 END`)), "onTime"],
          [sequelize.fn("SUM", sequelize.literal(`CASE WHEN "estimatedDelivery" IS NULL THEN 1 ELSE 0 END`)), "delivered"],
        ],
        where,
      });
    }
  }
  Items.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name is required"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "Estimated delivery must be a date"
        }
      }
    },
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
    hooks: {
      beforeCreate: (item) => {
        item.estimatedDelivery = dayjs(item.estimatedDelivery).add(7, "day").toDate();
      }
    }
  });
  return Items;
};
