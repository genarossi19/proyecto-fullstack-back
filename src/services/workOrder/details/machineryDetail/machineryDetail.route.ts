import { Router } from "express";
import machineryDetailController from "./machineryDetail.controller.ts";

const machineryDetailRouter = Router();

// Crear un detalle de maquinaria
machineryDetailRouter.post(
  "/",
  machineryDetailController.createMachineryDetail
);

// Obtener todos los detalles de maquinaria por workOrderId
machineryDetailRouter.get(
  "/workOrder/:workOrderId",
  machineryDetailController.getAllByWorkOrderId
);

// Actualizar un detalle de maquinaria
machineryDetailRouter.put(
  "/:id",
  machineryDetailController.updateMachineryDetail
);

// Eliminar un detalle de maquinaria
machineryDetailRouter.delete(
  "/:id",
  machineryDetailController.deleteMachineryDetail
);

export default machineryDetailRouter;
