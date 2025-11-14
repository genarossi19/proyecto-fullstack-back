import { Router } from "express";
import workOrderController from "./workOrder.controller.ts";

const workOrderRouter = Router();

// Crear una nueva WorkOrder con detalles opcionales
workOrderRouter.post("/", workOrderController.createWorkOrder);

// Obtener todas las WorkOrders
workOrderRouter.get("/", workOrderController.getAllWorkOrders);

// Obtener una WorkOrder por ID con detalles
workOrderRouter.get("/:id", workOrderController.getWorkOrderById);

// Actualizar WorkOrder (sin tocar detalles)
workOrderRouter.put("/:id", workOrderController.updateWorkOrder);

// Eliminar WorkOrder junto con sus detalles
workOrderRouter.delete("/:id", workOrderController.deleteWorkOrder);

export default workOrderRouter;
