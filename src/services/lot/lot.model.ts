import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize.js";

const Lot = sequelize.define(
  "Lot",
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
    area: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    long: {
      type: DataTypes.FLOAT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "lot",
    timestamps: false,
  }
);

export default Lot;
