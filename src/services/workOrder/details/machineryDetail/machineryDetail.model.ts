import { DataTypes, Model } from "sequelize";
import sequelize from "../../../../db/sequelize.js";
import WorkOrder from "../../workOrder.model.js";
import Machinery from "../../../machinery/machinery.model.js";
import type { MachineryDetailType } from "../../../../types/WorkOrder.js";

const MachineryDetail = sequelize.define<Model<MachineryDetailType>>(
  "MachineryDetail",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    workOrderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    machineryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "machinerydetail",
    timestamps: false,
  }
);

// Relaciones
MachineryDetail.belongsTo(WorkOrder, {
  foreignKey: "workOrderId",
  onDelete: "CASCADE",
});
MachineryDetail.belongsTo(Machinery, {
  as: "machinery",
  foreignKey: "machineryId",
});
WorkOrder.hasMany(MachineryDetail, {
  foreignKey: "workOrderId",
  onDelete: "CASCADE",
});

export default MachineryDetail;
