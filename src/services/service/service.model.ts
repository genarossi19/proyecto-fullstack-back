import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize";

const Service = sequelize.define(
  "Service",
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
        length: [2, 20],
      },
    },
  },
  {
    tableName: "service",
    timestamps: false,
  }
);
export default Service;
