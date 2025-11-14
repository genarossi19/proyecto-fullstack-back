import type { Request, Response } from "express";
import LotDetail from "./lotDetail.model.ts";
import Lot from "../../../lot/lot.model.ts";
import WorkOrder from "../../workOrder.model.ts";

// Crear un detalle de lote para una WorkOrder
export const addLotToWorkOrder = async (req: Request, res: Response) => {
  try {
    const { id: workOrderId } = req.params;
    const { lotId, area, lat, long } = req.body;

    // Validar workOrder
    const workOrder = await WorkOrder.findByPk(workOrderId);
    if (!workOrder) {
      return res.status(404).json({ message: "WorkOrder no encontrada" });
    }

    // Validar lote
    const lot = await Lot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }

    // Tomar valores originales del lote si no vinieron en el body
    const newDetail = await LotDetail.create({
      workOrderId: Number(workOrderId),
      lotId,
      area: area ?? lot.get("area"),
      lat: lat ?? lot.get("lat"),
      long: long ?? lot.get("long"),
    });

    return res.status(201).json(newDetail);
  } catch (error) {
    console.error("Error creando detalle de lote:", error);
    return res.status(500).json({ message: "Error creando detalle", error });
  }
};

// Obtener todos los detalles de lote de una WorkOrder
export const getAllByWorkOrderId = async (req: Request, res: Response) => {
  try {
    const { workOrderId } = req.params;

    const details = await LotDetail.findAll({
      where: { workOrderId },
      include: [
        {
          model: Lot,
          attributes: ["id", "name", "area", "lat", "long", "active"],
        },
      ],
    });

    return res.status(200).json(details);
  } catch (error) {
    console.error("Error al obtener detalles de lote:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener detalles", error });
  }
};

// Actualizar un detalle de lote
export const updateLotDetail = async (req: Request, res: Response) => {
  try {
    const { detailId } = req.params;
    const { area, lat, long } = req.body;

    const detail = await LotDetail.findByPk(detailId);

    if (!detail) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }

    await detail.update({
      area: area ?? detail.get("area"),
      lat: lat ?? detail.get("lat"),
      long: long ?? detail.get("long"),
    });

    return res.status(200).json(detail);
  } catch (error) {
    console.error("Error actualizando detalle de lote:", error);
    return res
      .status(500)
      .json({ message: "Error actualizando detalle", error });
  }
};

// Eliminar un detalle de lote
export const removeLotDetail = async (req: Request, res: Response) => {
  try {
    const { detailId } = req.params;

    const deleted = await LotDetail.destroy({
      where: { id: detailId },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }

    return res.status(200).json({ message: "Detalle eliminado" });
  } catch (error) {
    console.error("Error eliminando detalle de lote:", error);
    return res.status(500).json({ message: "Error eliminando detalle", error });
  }
};

export default {
  addLotToWorkOrder,
  getAllByWorkOrderId,
  updateLotDetail,
  removeLotDetail,
};
