import { Model, Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }

  User.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
