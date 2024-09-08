import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CollegeAttributes {
  id?: number;
  name: string;
}

interface CollegeCreationAttributes extends Optional<CollegeAttributes, 'id'> {}

class College extends Model<CollegeAttributes, CollegeCreationAttributes> implements CollegeAttributes {
  public id?: number;
  public name!: string;
}

College.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'colleges',
  }
);

export { College };
