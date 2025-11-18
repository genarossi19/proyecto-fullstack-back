import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/sequelize.js";
import Client from "../client/client.model.js";
import Service from "../service/service.model.js";
import Field from "../field/field.model.js";
import type { WorkOrderType } from "../../types/WorkOrder.js";

const WorkOrder = sequelize.define<
  Model<WorkOrderType, Omit<WorkOrderType, "name">>
>(
  "WorkOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    init_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finish_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "workorder",
    timestamps: false,
  }
);

WorkOrder.belongsTo(Client, { foreignKey: "clientId" });
WorkOrder.belongsTo(Service, { foreignKey: "serviceId" });
WorkOrder.belongsTo(Field, { foreignKey: "fieldId" });

export default WorkOrder;
