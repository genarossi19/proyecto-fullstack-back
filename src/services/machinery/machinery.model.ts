import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize";

const Machinery = sequelize.define(
  "Machinery",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        length: [2, 100],
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        length: [2, 50],
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        length: [2, 50],
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        length: [2, 50],
      },
    },
  },
  {
    tableName: "machinery",
    timestamps: false,
  }
);
export default Machinery;
