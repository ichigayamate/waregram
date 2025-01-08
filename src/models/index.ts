import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import process from 'process';
import configDatabase from '../config/configDatabase.json';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configDatabase[env];
const db: { [key: string]: any } = {};

let sequelize: SequelizeType;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      !file.startsWith('.') &&
      file !== basename &&
      file.endsWith('.ts') &&
      file.indexOf('.test.ts') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
