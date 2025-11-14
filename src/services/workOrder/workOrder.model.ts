import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/sequelize.ts";
import Client from "../client/client.model.ts";
import Service from "../service/service.model.ts";
import Field from "../field/field.model.ts";
import type { WorkOrderType } from "../../types/WorkOrder.ts";

const WorkOrder = sequelize.define<Model<WorkOrderType>>(
  "WorkOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
