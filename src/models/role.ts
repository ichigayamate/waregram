'use strict';
import {Model, Sequelize, DataTypes} from 'sequelize';

export default (sequelize: Sequelize) => {
    class Role extends Model {
        public id!: string;
        public name!: string;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }

    Role.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Role',
    });

    return Role;
};
