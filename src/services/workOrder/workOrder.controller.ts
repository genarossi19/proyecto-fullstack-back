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

// Crear una nueva WorkOrder con detalles opcionales
export const createWorkOrder = async (req: Request, res: Response) => {
  try {
    const {
      name,
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

    // Crear la WorkOrder principal
    const newWorkOrder = await WorkOrder.create({
      name,
      clientId,
      fieldId,
      serviceId,
      created_at: new Date(),
      init_date,
      finish_date,
      status,
      observation,
      price,
    });

    const workOrderId = newWorkOrder.get("id") as number;

    // Crear detalles de maquinaria si vienen en el body
    if (machineryDetails?.length) {
      for (const md of machineryDetails) {
        await MachineryDetail.create({
          workOrderId,
          machineryId: md.machineryId,
        });
      }
    }

    // Crear detalles de lotes si vienen en el body
    if (lotDetails?.length) {
      for (const ld of lotDetails) {
        await LotDetail.create({
          workOrderId,
          lotId: ld.lotId,
          area: ld.area,
          lat: ld.lat,
          long: ld.long,
        });
      }
    }

    // Traer los detalles creados para devolver al front
    const createdMachineryDetails = await MachineryDetail.findAll({
      where: { workOrderId },
    });

    const createdLotDetails = await LotDetail.findAll({
      where: { workOrderId },
    });

    // Construir el objeto de respuesta limpio
    const workOrderPlain = newWorkOrder.get({ plain: true });
    const response = {
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
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error al crear la WorkOrder:", error);
    res.status(500).json({ error: "Error al crear la WorkOrder" });
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
        { model: Client, attributes: ["id", "name", "email"] },
        { model: Field, attributes: ["id", "name", "area"] },
        { model: Service, attributes: ["id", "name"] },
      ],
    });

    const summarized: WorkOrderSummaryResponse[] = workOrders.map((wo) => {
      const plain = wo.get({ plain: true }) as any; // uso any para acceder a las relaciones cargadas
      return {
        id: plain.id,
        name: plain.name,
        client: plain.Client,
        field: plain.Field,
        service: plain.Service,
        init_date: plain.init_date,
        status: plain.status,
        price: plain.price,
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
