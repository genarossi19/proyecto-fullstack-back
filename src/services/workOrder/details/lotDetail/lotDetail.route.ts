import { Router } from "express";
import lotDetailController from "./lotDetail.controller.js";

const lotDetailRouter = Router();

// Crear un detalle de lote para una WorkOrder
lotDetailRouter.post(
  "/workOrder/:id/lots",
  lotDetailController.addLotToWorkOrder
);

// Obtener todos los detalles de lote de una WorkOrder
lotDetailRouter.get(
  "/workOrder/:workOrderId/lots",
  lotDetailController.getAllByWorkOrderId
);

// Actualizar un detalle de lote
lotDetailRouter.put(
  "/lotDetail/:detailId",
  lotDetailController.updateLotDetail
);

// Eliminar un detalle de lote
lotDetailRouter.delete(
  "/lotDetail/:detailId",
  lotDetailController.removeLotDetail
);

export default lotDetailRouter;
