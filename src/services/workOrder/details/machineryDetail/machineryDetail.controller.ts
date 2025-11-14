import type { Request, Response } from "express";
import MachineryDetail from "./machineryDetail.model.ts";
import Machinery from "../../../machinery/machinery.model.ts";

// Crear un detalle de maquinaria para una orden de trabajo
export const createMachineryDetail = async (req: Request, res: Response) => {
  try {
    const { workOrderId, machineryId } = req.body;

    if (!workOrderId || !machineryId) {
      return res
        .status(400)
        .json({ error: "workOrderId y machineryId son obligatorios" });
    }

    const newDetail = await MachineryDetail.create({
      workOrderId: Number(workOrderId),
      machineryId: Number(machineryId),
    });

    res.status(201).json(newDetail);
  } catch (error) {
    console.error("Error al crear detalle de maquinaria:", error);
    res.status(500).json({ error: "Error al crear detalle de maquinaria" });
  }
};

// Obtener todos los detalles de maquinaria por WorkOrderId
export const getAllByWorkOrderId = async (req: Request, res: Response) => {
  try {
    const { workOrderId } = req.params;

    const details = await MachineryDetail.findAll({
      where: { workOrderId },
      include: [
        {
          model: Machinery,
          attributes: ["id", "name", "type", "brand", "model"],
        },
      ],
    });

    res.status(200).json(details);
  } catch (error) {
    console.error("Error al obtener detalles de maquinaria:", error);
    res.status(500).json({ error: "Error al obtener detalles de maquinaria" });
  }
};

// Actualizar un detalle de maquinaria
export const updateMachineryDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { machineryId } = req.body;

    const detail = await MachineryDetail.findByPk(id);
    if (!detail)
      return res.status(404).json({ error: "Detalle no encontrado" });

    if (machineryId) detail.set("machineryId", Number(machineryId));

    await detail.save();

    res.status(200).json(detail);
  } catch (error) {
    console.error("Error al actualizar detalle de maquinaria:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar detalle de maquinaria" });
  }
};

// Eliminar un detalle de maquinaria
export const deleteMachineryDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const detail = await MachineryDetail.findByPk(id);
    if (!detail)
      return res.status(404).json({ error: "Detalle no encontrado" });

    await detail.destroy();

    res.status(200).json({ message: "Detalle eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle de maquinaria:", error);
    res.status(500).json({ error: "Error al eliminar detalle de maquinaria" });
  }
};

export default {
  createMachineryDetail,
  getAllByWorkOrderId,
  updateMachineryDetail,
  deleteMachineryDetail,
};
