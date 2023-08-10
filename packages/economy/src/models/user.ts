import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: string;
    name: string;
}

export default function init(sequelize: Sequelize) {
    return sequelize.define<User>('CrossfishEcoUser', {
        id: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
      });
}