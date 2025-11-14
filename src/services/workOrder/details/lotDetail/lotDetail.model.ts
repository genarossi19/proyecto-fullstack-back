import { DataTypes, Model } from "sequelize";
import sequelize from "../../../../db/sequelize.ts";
import WorkOrder from "../../workOrder.model.ts";
import Lot from "../../../lot/lot.model.ts";
import type { LotDetailType } from "../../../../types/WorkOrder.ts";

const LotDetail = sequelize.define<Model<LotDetailType>>(
  "LotDetail",
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
    lotId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    area: {
      type: DataTypes.DECIMAL,
    },
    lat: {
      type: DataTypes.DECIMAL,
    },
    long: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    tableName: "lotdetail",
    timestamps: false,
  }
);

LotDetail.belongsTo(WorkOrder, { foreignKey: "workOrderId" });
LotDetail.belongsTo(Lot, { foreignKey: "lotId" });

WorkOrder.hasMany(LotDetail, { foreignKey: "workOrderId" });

export default LotDetail;
