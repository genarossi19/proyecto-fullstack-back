import express from "express";
import serviceController from "./service.controller.ts";
import { authenticateToken } from "../../middleware/auth.ts";
const serviceRouter = express.Router();

// Crear un nuevo servicio
serviceRouter.post("/", authenticateToken, serviceController.createService);

// Obtener todos los servicios
serviceRouter.get("/", authenticateToken, serviceController.getAllServices);

// Obtener un servicio por ID
serviceRouter.get("/:id", authenticateToken, serviceController.getServiceById);

// Actualizar un servicio
serviceRouter.put("/:id", authenticateToken, serviceController.updateService);

// Eliminar un servicio
serviceRouter.delete(
  "/:id",
  authenticateToken,
  serviceController.deleteService
);

export default serviceRouter;
