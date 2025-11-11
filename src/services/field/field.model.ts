import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize.ts";

const Field = sequelize.define(
  "Field",
  {
    id: {
      type: DataTypes.BIGINT, // coincide con int8 de Postgres
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
    clientId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "field",
    timestamps: false,
  }
);

export default Field;
