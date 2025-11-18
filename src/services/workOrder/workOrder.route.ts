import { Router } from "express";
import workOrderController from "./workOrder.controller.js";
import { authenticateToken } from "../../middleware/auth.js";

const workOrderRouter = Router();

// Crear una nueva WorkOrder con detalles opcionales
workOrderRouter.post(
  "/",
  authenticateToken,
  workOrderController.createWorkOrder
);

// Obtener todas las WorkOrders
workOrderRouter.get(
  "/",
  authenticateToken,
  workOrderController.getAllWorkOrders
);

// Obtener una WorkOrder por ID con detalles
workOrderRouter.get(
  "/:id",
  authenticateToken,
  workOrderController.getWorkOrderById
);

// Actualizar WorkOrder (sin tocar detalles)
workOrderRouter.put(
  "/:id",
  authenticateToken,
  workOrderController.updateWorkOrder
);

// Eliminar WorkOrder junto con sus detalles
workOrderRouter.delete(
  "/:id",
  authenticateToken,
  workOrderController.deleteWorkOrder
);

export default workOrderRouter;
