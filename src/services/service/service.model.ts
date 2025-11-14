import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize.ts";

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
    },
  },
  {
    tableName: "service",
    timestamps: false,
  }
);
export default Service;
