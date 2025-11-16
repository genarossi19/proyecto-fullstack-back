import type { Request, Response } from "express";
import WorkOrder from "./workOrder.model.ts";
import Client from "../client/client.model.ts";
import Field from "../field/field.model.ts";
import Service from "../service/service.model.ts";
import MachineryDetail from "./details/machineryDetail/machineryDetail.model.ts";
import LotDetail from "./details/lotDetail/lotDetail.model.ts";
import type {
  WorkOrderDetailResponse,
  WorkOrderSummaryResponse,
  WorkOrderType,
} from "src/types/WorkOrder.ts";
import sequelize from "../../db/sequelize.ts";

// Crear una nueva WorkOrder con detalles opcionales
export const createWorkOrder = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const {
      name, // lo ignoramos, se genera automático
      init_date,
      finish_date,
      status,
      observation,
      price,
      clientId,
      fieldId,
      serviceId,
      machineryDetails,
      lotDetails,
    } = req.body;

    // 1) Crear WorkOrder SIN name, dentro de la transacción
    const newWorkOrder = await WorkOrder.create(
      {
        clientId,
        fieldId,
        serviceId,
        created_at: new Date(),
        init_date,
        finish_date,
        status,
        observation,
        price,
      },
      { transaction: t }
    );

    const workOrderId = newWorkOrder.get("id") as number;

    // 2) Generar name y actualizar dentro de la MISMA transacción
    const generatedName = `OT-${String(workOrderId).padStart(3, "0")}`;
    await newWorkOrder.update({ name: generatedName }, { transaction: t });

    // 3) Crear detalles de maquinaria dentro de la transacción
    if (Array.isArray(machineryDetails) && machineryDetails.length) {
      for (const md of machineryDetails) {
        await MachineryDetail.create(
          {
            workOrderId,
            machineryId: md.machineryId,
          },
          { transaction: t }
        );
      }
    }

    // 4) Crear detalles de lote dentro de la transacción
    if (Array.isArray(lotDetails) && lotDetails.length) {
      for (const ld of lotDetails) {
        await LotDetail.create(
          {
            workOrderId,
            lotId: ld.lotId,
            area: ld.area,
            lat: ld.lat,
            long: ld.long,
          },
          { transaction: t }
        );
      }
    }

    // 5) Commit — todo fue exitoso
    await t.commit();

    // 6) Obtener los detalles ya creados (fuera de la transacción)
    const createdMachineryDetails = await MachineryDetail.findAll({
      where: { workOrderId },
    });
    const createdLotDetails = await LotDetail.findAll({
      where: { workOrderId },
    });

    const workOrderPlain = newWorkOrder.get({ plain: true });

    return res.status(201).json({
      id: workOrderPlain.id,
      name: workOrderPlain.name,
      created_at: workOrderPlain.created_at,
      init_date: workOrderPlain.init_date,
      finish_date: workOrderPlain.finish_date,
      status: workOrderPlain.status,
      observation: workOrderPlain.observation,
      price: workOrderPlain.price,
      clientId: workOrderPlain.clientId,
      fieldId: workOrderPlain.fieldId,
      serviceId: workOrderPlain.serviceId,
      machineryDetails: createdMachineryDetails,
      lotDetails: createdLotDetails,
    });
  } catch (error) {
    // rollback garantiza que NO quede OT sin name
    await t.rollback();
    console.error("Error al crear la WorkOrder:", error);
    return res.status(500).json({ error: "Error al crear la WorkOrder" });
  }
};

// Obtener todas las WorkOrders (resumen)
export const getAllWorkOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workOrders = await WorkOrder.findAll({
      include: [
        { model: Client, attributes: ["id", "name"] },
        { model: Field, attributes: ["id", "name", "area"] },
        { model: Service, attributes: ["id", "name"] },
      ],
    });

    const summarized: WorkOrderSummaryResponse[] = workOrders.map((wo) => {
      const plain = wo.get({ plain: true }) as any; // uso any para acceder a las relaciones cargadas
      return {
        id: plain.id,
        name: plain.name,
        service: plain.Service,
        status: plain.status,
        init_date: plain.init_date,
        finish_date: plain.finish_date,
        created_at: plain.created_at,
        client: plain.Client,
        field: plain.Field,
      };
    });

    res.status(200).json(summarized);
  } catch (error) {
    console.error("Error al obtener WorkOrders:", error);
    res.status(500).json({ error: "Error al obtener WorkOrders" });
  }
};

// Obtener una WorkOrder por ID con todos los detalles
export const getWorkOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workOrder = await WorkOrder.findByPk(id, {
      include: [
        { model: Client, attributes: ["id", "name", "email"] },
        { model: Field, attributes: ["id", "name", "area", "lat", "long"] },
        { model: Service, attributes: ["id", "name"] },
      ],
    });

    if (!workOrder) {
      return res.status(404).json({ error: "WorkOrder no encontrada" });
    }

    const machineryDetails = await MachineryDetail.findAll({
      where: { workOrderId: workOrder.get("id") as number },
    });

    const lotDetails = await LotDetail.findAll({
      where: { workOrderId: workOrder.get("id") as number },
    });

    const plainWorkOrder = workOrder.get({ plain: true }) as any;

    // Devolver objeto completo sin IDs redundantes
    const response: WorkOrderDetailResponse = {
      id: plainWorkOrder.id,
      name: plainWorkOrder.name,
      created_at: plainWorkOrder.created_at,
      init_date: plainWorkOrder.init_date,
      finish_date: plainWorkOrder.finish_date,
      status: plainWorkOrder.status,
      observation: plainWorkOrder.observation,
      price: plainWorkOrder.price,
      client: plainWorkOrder.Client,
      field: plainWorkOrder.Field,
      service: plainWorkOrder.Service,
      machineryDetails,
      lotDetails,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener la WorkOrder:", error);
    res.status(500).json({ error: "Error al obtener la WorkOrder" });
  }
};

// Actualizar WorkOrder (sin tocar detalles)
export const updateWorkOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workOrder = await WorkOrder.findByPk(id);

    if (!workOrder) {
      return res.status(404).json({ error: "WorkOrder no encontrada" });
    }

    const updatableFields: (keyof WorkOrderType)[] = [
      "name",
      "init_date",
      "finish_date",
      "status",
      "observation",
      "price",
      "clientId",
      "fieldId",
      "serviceId",
    ];

    updatableFields.forEach((field) => {
      const value = req.body[field];
      if (value !== undefined) workOrder.set(field, value);
    });

    await workOrder.save();

    res.status(200).json(workOrder.get({ plain: true }));
  } catch (error) {
    console.error("Error al actualizar WorkOrder:", error);
    res.status(500).json({ error: "Error al actualizar WorkOrder" });
  }
};

// Eliminar WorkOrder junto con sus detalles
export const deleteWorkOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workOrder = await WorkOrder.findByPk(id);

    if (!workOrder) {
      return res.status(404).json({ error: "WorkOrder no encontrada" });
    }

    await MachineryDetail.destroy({ where: { workOrderId: id } });
    await LotDetail.destroy({ where: { workOrderId: id } });

    await workOrder.destroy();

    res.status(200).json({ message: "WorkOrder eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar WorkOrder:", error);
    res.status(500).json({ error: "Error al eliminar WorkOrder" });
  }
};

export default {
  createWorkOrder,
  getAllWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  deleteWorkOrder,
};
