import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize";

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.BIGINT, // coincide con int8 de Postgres
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cuit: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "client",
    timestamps: false,
  }
);
export default Client;
