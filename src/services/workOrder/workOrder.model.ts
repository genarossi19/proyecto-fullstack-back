import { DataTypes } from "sequelize";
import sequelize from "../../db/sequelize";
import Client from "../client/client.model";
import Service from "../service/service.model";
import Field from "../field/field.model";

const WorkOrder = sequelize.define(
  "WorkOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    init_date: {
      type: DataTypes.DATE,
    },
    finish_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
    observations: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.NUMBER,
    },
    clientId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },

  {
    tableName: "work_order",
    timestamps: false,
  }
);

WorkOrder.belongsTo(Client, { foreignKey: "clientId" });
WorkOrder.belongsTo(Service, { foreignKey: "serviceId" });
WorkOrder.belongsTo(Field, { foreignKey: "fieldId" });

export default WorkOrder;
