import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/sequelize.ts";
import type { MachineryType } from "../../types/MachineryType.ts";

const Machinery = sequelize.define<Model<MachineryType>>(
  "Machinery",
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
      validate: { len: [2, 100] },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 50] },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 50] },
    },
    patent: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(
        "En Uso",
        "Mantenimiento",
        "Disponible",
        "Fuera de Servicio"
      ),
      allowNull: false,
      defaultValue: "Disponible",
    },
  },
  {
    tableName: "machinery",
    timestamps: false,
    hooks: {
      beforeCreate: (machinery) => {
        const rawType = machinery.getDataValue("type");
        if (rawType) {
          machinery.setDataValue("type", rawType.trim().toUpperCase());
        }
      },
      beforeUpdate: (machinery) => {
        const rawType = machinery.getDataValue("type");
        if (rawType) {
          machinery.setDataValue("type", rawType.trim().toUpperCase());
        }
      },
    },
  }
);

export default Machinery;
