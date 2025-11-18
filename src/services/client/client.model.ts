import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize.js";
import Field from "../field/field.model.js";
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
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
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

Field.belongsTo(Client, {
  as: "client",
  foreignKey: "clientId",
  targetKey: "id",
});
Client.hasMany(Field, {
  as: "fields",
  foreignKey: "clientId",
  sourceKey: "id",
});

export default Client;
