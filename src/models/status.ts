import { Model, Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Status extends Model {
    public id!: string;
    public title!: string;
    public body!: string;
    public user_id!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }

  Status.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Status',
  });

  return Status;
};
